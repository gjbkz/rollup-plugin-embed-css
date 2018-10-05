const path = require('path');
const {createFilter, dataToEsm} = require('rollup-pluginutils');
const afs = require('@nlib/afs');
const postcss = require('postcss');
let typescript = null;

const getDependencies = (ast, id) => {
    const directory = path.dirname(id);
    const dependencies = new Map();
    let count = 0;
    ast.walkAtRules((node) => {
        if (node.name !== 'import') {
            return;
        }
        node.params.trim()
        .replace(/^(['"])([^\s'"]+)\1\s*([^\s]*)$/, (match, quote, target, givenName) => {
            count += 1;
            const name = givenName || `$${count}`;
            dependencies.set(name, afs.absolutify(target, directory));
            node.remove();
        });
    });
    return dependencies;
};

const minify = (ast) => {
    const {raws} = ast;
    for (const key of ['before', 'between', 'after']) {
        const value = raws[key];
        if (value) {
            raws[key] = value.replace(/\s/g, '');
        }
    }
    return ast;
};

class Labeler extends Map {

    label(value) {
        if (!this.has(value)) {
            this.set(value, {label: this.size, count: 0});
        }
        const item = this.get(value);
        item.count += 1;
        return item.label;
    }

    sort() {
        const sorted = [...this].sort(([keyA, {count: a}], [keyB, {count: b}]) => (a === b ? keyA < keyB : a < b) ? 1 : -1);
        const mapper = [];
        sorted.forEach(([, {label}], index) => {
            mapper[label] = index;
        });
        return {sorted, mapper};
    }

}

const encodeString = (string, labeler = new Labeler()) => {
    let pos = 0;
    const encoded = [];
    const REGEXP = /[.0-9]+|[^a-zA-Z]/g;
    while (1) {
        const match = REGEXP.exec(string);
        if (match) {
            const {0: matched, index} = match;
            if (pos < index) {
                encoded.push(labeler.label(string.slice(pos, index)));
            }
            encoded.push(labeler.label(matched));
        } else {
            const rest = string.slice(pos).trim();
            if (rest) {
                encoded.push(labeler.label(rest));
            }
            break;
        }
        pos = REGEXP.lastIndex;
    }
    const {sorted, mapper} = labeler.sort();
    return {
        encoded: encoded.map((label) => mapper[label]),
        words: sorted.map(([phrase]) => phrase),
    };
};

const decodeString = (encoded, words) => encoded.map((index) => words[index]).join('');

const genereateCSSScript = (css) => {
    const {encoded, words} = encodeString(css.trim());
    return `
(function (encoded, words, link) {
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', URL.createObjectURL(
        new Blob(
            encoded.map(function (index) {
                return words[index];
            }),
            {type: 'text/css'}
        )
    ));
    URL.revokeObjectURL(link.getAttribute('href'));
}(
    ${JSON.stringify(encoded)},
    ${JSON.stringify(words)},
    document.head.appendChild(document.createElement('link'))
));`;
};

const getCSSAST = async (id, source, config) => {
    const processOptions = {from: id, ...config.processOptions};
    return config.plugins
    ? (await postcss(config.plugins).process(source, processOptions)).root
    : postcss.parse(source, processOptions);
};

const getCSSFromCache = (cache) => [].concat(...[...cache].map(([, {ast}]) => ast.toString())).join('');

// options.mangler
// options.mangle
// options.labeler
// options.base
const getMangler = (options) => {
    let {mangler} = options;
    if (!mangler) {
        if (options.mangle) {
            const labeler = options.labeler || new Labeler();
            mangler = (id, className) => `_${labeler.label(`${id}/${className}`).toString(36)}`;
        } else {
            const base = options.base || process.cwd();
            mangler = (id, className) => [
                path.relative(base, id).replace(/^(\w)/, '_$1').replace(/[^\w]+/g, '_'),
                className,
            ].join('_');
        }
    }
    return mangler;
};

const processCSSAST = ({id, ast, dependencies}, config) => {
    const classes = {};
    const properties = {};
    ast.walk((node) => {
        minify(node);
        if (node.type === 'rule') {
            node.selector = node.selector.replace(/([$_a-zA-Z0-9-]*)?\.(=?-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g, (match, imported, className) => {
                if (className.startsWith('=')) {
                    const prefixRemovedClassName = className.slice(1);
                    classes[prefixRemovedClassName] = prefixRemovedClassName;
                    return `.${prefixRemovedClassName}`;
                } else if (imported && dependencies.has(imported)) {
                    const sourceId = dependencies.get(imported);
                    const {classes: sourceClasses} = config.cache.get(sourceId);
                    return `.${sourceClasses[className]}`;
                } else {
                    if (!classes[className]) {
                        classes[className] = config.mangler(id, className);
                    }
                    return `.${classes[className]}`;
                }
            });
            node.raws.before = '\n';
        } else if (node.type === 'decl' && node.prop.startsWith('--')) {
            const propertyName = node.prop.slice(2);
            properties[propertyName] = node.value;
        }
    });
    return {classes, properties};
};

const generateTypeDefinitions = ({classes, properties}, {classesOnly}) => `
export const classes = ${JSON.stringify(classes)};
export const properties = ${JSON.stringify(properties)};
export default ${classesOnly ? 'classes' : '{classes, properties}'};
`;

const parse = async (id, source, config) => {
    const css = source || await afs.readFile(id, 'utf8');
    const hash = afs.getHash(css);
    const cached = config.cache.get(id);
    if (cached && hash === cached.hash) {
        return cached;
    }
    const ast = minify(await getCSSAST(id, css, config));
    const dependencies = getDependencies(ast, id);
    for (const [, id] of dependencies) {
        await parse(id, null, config);
    }
    const {classes, properties} = processCSSAST({id, ast, dependencies}, config);
    const result = {hash, ast, classes, dependencies, properties};
    if (config.typescript) {
        const dest = `${id}.d.ts`;
        const code = generateTypeDefinitions(result, config);
        await afs.writeFile(dest, code);
    }
    if (config.onParse) {
        await config.onParse({
            id,
            ast,
            classes: Object.assign({}, classes),
            properties: Object.assign({}, properties),
        });
    }
    config.cache.set(id, result);
    return result;
};

const getImportees = function* (ast) {
    for (const node of ast.body) {
        if (node.type === 'ImportDeclaration') {
            yield node.source.value;
        }
    }
};

class Cache extends Map {}

module.exports = (options = {}) => {
    const config = {
        filter: createFilter(options.include || '/**/*.css', options.exclude),
        cache: options.cache || new Cache(),
        mangler: getMangler(options),
        plugins: options.plugins,
        processOptions: options.processOptions,
        acornOptions: options.acornOptions || {ecmaVersion: 2018},
        classesOnly: options.classesOnly,
        onParse: options.onParse,
        dest: options.dest,
        typescript: options.typescript,
    };
    if (config.typescript) {
        typescript = require('typescript');
    }
    return {
        name: 'embedCSS',
        async resolveId(id) {
            if (typescript && path.extname(id) === '.ts') {
                const source = await afs.readFile(id, 'utf8');
                const {outputText} = typescript.transpileModule(source, {
                    compilerOptions: {module: 'esnext'},
                });
                const ast = this.parse(outputText, config.acornOptions);
                for (const importee of getImportees(ast)) {
                    if (path.extname(importee) === '.css') {
                        await parse(path.join(path.dirname(id), importee), null, config);
                    }
                }
            }
            return null;
        },
        async transform(source, id) {
            if (!config.filter(id)) {
                return null;
            }
            const {classes, properties, dependencies} = await parse(id, source, config);
            const directory = path.dirname(id);
            return {
                code: [
                    ...[...dependencies].map(([, required]) => `import './${path.relative(directory, required).replace(/\\/g, '/')}';`),
                    dataToEsm(config.classesOnly ? classes : {classes, properties}),
                ].join('\n'),
                map: {mappings: ''},
            };
        },
        async buildEnd() {
            if (config.dest) {
                await afs.updateFile(config.dest, getCSSFromCache(config.cache));
            }
        },
        renderChunk(source) {
            if (config.dest) {
                return null;
            }
            return {
                code: `${source}${genereateCSSScript(getCSSFromCache(config.cache))}`,
                map: null,
            };
        },
    };
};

Object.assign(module.exports, {
    encodeString,
    decodeString,
    Labeler,
    Cache,
});
