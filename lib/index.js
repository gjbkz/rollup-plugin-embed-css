const path = require('path');
const {createFilter, dataToEsm} = require('rollup-pluginutils');
const afs = require('@nlib/afs');
const postcss = require('postcss');
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
            }).join(''),
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

class EmbedCSSPlugin {

    constructor(options = {}) {
        this.filter = createFilter(options.include || '/**/*.css', options.exclude);
        this.plugins = options.plugins;
        this.processOptions = options.processOptions;
        this.url = options.url;
        this.dest = options.dest;
        this.silent = options.silent;
        this.cache = new Map();
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
        this.mangle = mangler;
        return {
            name: 'embedCSS',
            transform: (...args) => this.transform(...args),
            buildEnd: (...args) => this.buildEnd(...args),
            renderChunk: (...args) => this.renderChunk(...args),
        };
    }

    async getCSSAST(source, id) {
        const processOptions = {from: id, ...this.processOptions};
        return this.plugins
        ? (await postcss(this.plugins).process(source, processOptions)).root
        : postcss.parse(source, processOptions);
    }

    async parse(id, css) {
        css = css || await afs.readFile(id, 'utf8');
        const hash = afs.getHash(css);
        const cached = this.cache.get(id);
        if (cached && hash === cached.hash) {
            return cached;
        }
        const ast = minify(await this.getCSSAST(css, id));
        const dependencies = getDependencies(ast, id);
        for (const [, id] of dependencies) {
            await this.parse(id);
        }
        const classes = {};
        const properties = {};
        ast.walk((node) => {
            minify(node);
            if (node.type === 'rule') {
                node.selector = node.selector.replace(/([$_a-zA-Z0-9-]*)?\.=?(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g, (match, imported, className) => {
                    if (imported) {
                        const sourceId = dependencies.get(imported);
                        const {classes: sourceClasses} = this.cache.get(sourceId);
                        return `.${sourceClasses[className]}`;
                    } else {
                        if (!classes[className]) {
                            classes[className] = this.mangle(id, className);
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
        const result = {hash, ast, classes, dependencies, properties};
        this.cache.set(id, result);
        return result;
    }

    async transform(source, id) {
        if (!this.filter(id)) {
            return null;
        }
        const {classes, properties, dependencies} = await this.parse(id, source);
        const directory = path.dirname(id);
        return {
            code: [
                ...[...dependencies].map(([, required]) => `import './${path.relative(directory, required).replace(/\\/g, '/')}';`),
                dataToEsm({classes, properties}),
            ].join('\n'),
            map: {mappings: ''},
        };
    }

    get css() {
        return [].concat(...[...this.cache].map(([, {ast}]) => ast.toString())).join('');
    }

    async buildEnd() {
        if (this.dest) {
            await afs.updateFile(this.dest, this.css);
        }
    }

    renderChunk(source) {
        if (this.dest) {
            return null;
        }
        return {
            code: `${source}${genereateCSSScript(this.css)}`,
            map: null,
        };
    }

}

module.exports = Object.assign((options) => new EmbedCSSPlugin(options), {
    encodeString,
    decodeString,
    Labeler,
});
