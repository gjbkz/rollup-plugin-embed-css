const fs = require('fs');
const path = require('path');
const {Labeler} = require('j1/labeler');
const promisify = require('j1/promisify');
const readFile = promisify(fs.readFile, fs);
const {createFilter} = require('rollup-pluginutils');
const postcss = require('postcss');
const BigNumber = require('bignumber.js');
const encodeString = require('./encodeString');
const generageCode = require('./generageCode');
const RADIX = 62;

function minify(node) {
	const {raws, nodes = []} = node;
	for (const key of ['before', 'between', 'after']) {
		const value = raws[key];
		if (value) {
			raws[key] = value.replace(/\s/g, '');
		}
	}
	for (const childNode of nodes) {
		minify(childNode);
	}
	return node;
}

function plugin(params = {}) {

	const filter = createFilter(params.include, params.exclude);
	const classLabeler = new Labeler('classNames');
	const roots = new Map();
	const cache = new Map();

	async function load(id, givenSource) {
		if (!givenSource && cache.has(id)) {
			return cache.get(id);
		}
		const source = givenSource || await readFile(id, 'utf8');
		const {root} = await postcss(params.postcss || []).process(source);
		const classNames = {};
		const dependencies = new Map();
		root.walkAtRules((node, index) => {
			if (node.name === 'import') {
				node.params.trim().replace(/^(['"])([^\s'"]+)\1\s*([^\s]*)$/, (match, quote, target, givenName) => {
					const name = givenName || `$${index + 1}`;
					dependencies.set(name, target);
					node.remove();
				});
			}
		});
		const replacements = new Map();
		for (const [name, target] of dependencies) {
			const {classNames: importedClassNames} = await load(path.join(path.dirname(id), target));
			for (const className of Object.keys(importedClassNames)) {
				replacements.set(importedClassNames[className], `${name}.${className}`);
			}
		}
		root.walkRules((rule) => {
			const {selector} = rule;
			let replaceCount = 0;
			rule.selector = Array.from(replacements)
			.reduce((selector, [to, from]) => {
				return selector.split(from).join(`.${to}`);
			}, selector)
			.replace(/\.([^,\s>+~:\[\]]+)/g, (match, className) => {
				if (replacements.has(className)) {
					return match;
				}
				replaceCount++;
				const label = classLabeler.label(`${id}${className}`);
				const newClassName = `_${new BigNumber(label).toString(RADIX)}`;
				classNames[className] = newClassName;
				return `.${newClassName}`;
			});
			if (0 < replaceCount && params.debug) {
				rule.before({text: selector.replace(/[\r\n]+/, ' ')});
			}
		});
		roots.set(id, root);
		cache.set(id, classNames);
		return {
			classNames,
			dependencies
		};
	}

	return {
		name: 'embed-css',
		async transform (source, id) {
			if (!filter(id) || path.extname(id) !== '.css') {
				return null;
			}
			const {classNames, dependencies} = await load(id, source);
			const code = [
				...Array.from(dependencies)
				.map(([, target]) => {
					return `import '${target}';`;
				}),
				`export default ${JSON.stringify(classNames, null, '\t')};`
			].join('\n');
			return code;
		},
		transformBundle(source) {
			const labeler = new Labeler('css');
			const encodedRules = [];
			for (const [, root] of roots) {
				encodedRules.push(
					...(params.debug ? root : minify(root)).nodes
					.map((node) => {
						return encodeString(`${node}`, labeler);
					})
				);
			}
			return `${source}\n${generageCode(labeler.items, encodedRules, params.debug)}`;
		}
	};
}
module.exports = plugin;
