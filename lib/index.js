const console = require('console');
const {createFilter} = require('rollup-pluginutils');
const afs = require('@nlib/afs');
const postcss = require('postcss');

const getDependencies = (root) => {
    const classNames = {};
    const dependencies = new Map();
    root.walkAtRules((node, index) => {
        if (node.name !== 'import') {
            return;
        }
        node.params.trim()
        .replace(/^(['"])([^\s'"]+)\1\s*([^\s]*)$/, (match, quote, target, givenName) => {
            const name = givenName || `$${index + 1}`;
            dependencies.set(name, target);
            node.remove();
        });
    });
    const replacements = new Map();
};

class EmbedCSSPlugin {

    constructor(options = {}) {
        this.name = 'embedCSS';
        this.filter = createFilter(options.include || '**/*.css', options.exclude);
        this.plugins = options.plugins;
        this.parseOptions = options.parseOptions;
        return {
            load: (...args) => this.load(...args),
        };
    }

    async parse(id) {
        const css = await afs.readFile(id, 'utf8');
        const parseOptions = {from: id, ...this.parseOptions};
        const root = this.plugins
        ? await postcss(this.plugins).process(css, parseOptions)
        : postcss.parse(css, parseOptions);
        return root;
    }

    async load(id) {
        if (!this.filter(id)) {
            return null;
        }
        console.log(await this.parse(id));
        return [
            'export const classes = {};',
            'export const properties = {};',
        ].join('\n');
    }

}

module.exports = Object.assign((options) => new EmbedCSSPlugin(options), {

});
