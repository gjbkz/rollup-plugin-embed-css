const path = require('path');
const console = require('console');
const {createFilter} = require('rollup-pluginutils');
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
            this.set(value, this.size);
        }
        return this.get(value);
    }

}

class EmbedCSSPlugin {

    constructor(options = {}) {
        this.filter = createFilter(options.include || '/**/*.css', options.exclude);
        this.plugins = options.plugins;
        this.parseOptions = options.parseOptions;
        this.url = options.url;
        this.dest = options.dest;
        this.silent = options.silent;
        this.cache = new Map();
        let {mangler} = options;
        if (!mangler) {
            if (options.mangle) {
                const labeler = options.labeler || new Labeler();
                mangler = (id, className) => `_${labeler.label(`${id}/${className}`)}`;
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
            load: (...args) => this.load(...args),
            buildEnd: (...args) => this.buildEnd(...args),
        };
    }

    async getCSSAST(id) {
        const css = await afs.readFile(id, 'utf8');
        const parseOptions = {from: id, ...this.parseOptions};
        return this.plugins
        ? postcss(this.plugins).process(css, parseOptions)
        : postcss.parse(css, parseOptions);
    }

    async parse(id) {
        const css = await afs.readFile(id, 'utf8');
        const hash = afs.getHash(css);
        const cached = this.cache.get(id);
        if (cached && hash === cached.hash) {
            return cached;
        }
        const ast = minify(await this.getCSSAST(id));
        const dependencies = getDependencies(ast, id);
        await Promise.all([...dependencies].map(([, id]) => this.parse(id)));
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
                if ((propertyName in properties) && !this.silent) {
                    console.error(`--${propertyName} is defined multiple times: ${properties[propertyName]} -> ${node.value}\n@${id}`);
                }
                properties[propertyName] = node.value;
            }
        });
        const result = {hash, ast, classes, dependencies, properties};
        this.cache.set(id, result);
        return result;
    }

    async load(id) {
        if (!this.filter(id)) {
            return null;
        }
        const {classes, properties} = await this.parse(id);
        return [
            `export const classes = ${JSON.stringify(classes)};`,
            `export const properties = ${JSON.stringify(properties)};`,
        ].join('\n');
    }

    get css() {
        return [...this.cache].map(([, {ast}]) => ast.toString()).join('');
    }

    async buildEnd() {
        await afs.updateFile(this.dest, this.css);
    }

}

module.exports = Object.assign((options) => new EmbedCSSPlugin(options), {
    Labeler,
});
