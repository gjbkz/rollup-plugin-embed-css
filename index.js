const path = require('path');
const {Labeler} = require('j1/labeler');
const {createFilter} = require('rollup-pluginutils');
const postcss = require('postcss');
const BigNumber = require('bignumber.js');
const encodeString = require('./encodeString');
const generageCode = require('./generageCode');
const RADIX = 62;

function plugin(params = {}) {

	const filter = createFilter(params.include, params.exclude);
	const classLabeler = new Labeler('classNames');
	const cache = new Map();

	return {
		name: 'embed-css',
		async transform (source, id) {
			if (!filter(id) || path.extname(id) !== '.css') {
				return null;
			}
			const {root} = await postcss(params.postcss || []).process(source);
			const labeled = {};
			root.walkRules((rule) => {
				const {selector} = rule;
				let replaceCount = 0;
				rule.selector = selector.replace(/\.([^,\s]+)/g, (match, className) => {
					replaceCount++;
					const label = classLabeler.label(`${id}${className}`);
					const newClassName = `_${new BigNumber(label).toString(RADIX)}`;
					labeled[className] = newClassName;
					return `.${newClassName}`;
				});
				if (0 < replaceCount && params.debug) {
					rule.before({text: selector});
				}
			});
			cache.set(id, root.nodes);
			return `export default ${JSON.stringify(labeled, null, '\t')};`;
		},
		transformBundle(source) {
			const root = postcss.root();
			for (const [, nodes] of cache) {
				root.append(...nodes);
			}
			root.walk(({raws}) => {
				for (const key of ['before', 'between', 'after']) {
					const value = raws[key];
					if (value) {
						raws[key] = value.replace(/\s/g, '');
					}
				}
			});
			const labeler = new Labeler('css');
			const encodedRules = root.nodes
			.map((node) => {
				return encodeString(`${node}`, labeler);
			});
			return `${source}\n${generageCode(labeler.items, encodedRules, params.debug)}`;
		}
	};
}
module.exports = plugin;
