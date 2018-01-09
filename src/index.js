const fs = require('fs');
const path = require('path');
const {createFilter} = require('rollup-pluginutils');
const postcss = require('postcss');
const BigNumber = require('bignumber.js');
const Labeler = require('./-labeler');
const encodeString = require('./encode-string');
const generateCode = require('./generate-code');
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

module.exports = function plugin(params = {}) {

	const filter = createFilter(params.include, params.exclude);
	const classLabeler = params.labeler || new Labeler();
	const roots = new Map();
	const cache = new Map();

	return {
		name: 'embed-css',
		transform(source, id) {
			if (!filter(id) || path.extname(id) !== '.css') {
				return null;
			}
			return load(id, source)
			.then(({classNames, dependencies}) => {
				const code = [
					...Array.from(dependencies)
					.map(([, target]) => {
						return `import '${target}';`;
					}),
					`export default ${JSON.stringify(classNames, null, '\t')};`,
				].join('\n');
				return {
					code,
					map: {mappings: ''},
				};
			});
		},
		outro() {
			const labeler = new Labeler();
			const encodedRules = [];
			for (const [, root] of roots) {
				encodedRules.push(
					...(params.debug ? root : minify(root)).nodes
					.map((node) => {
						return encodeString(`${node}`, labeler);
					})
				);
			}
			return generateCode(labeler, encodedRules, params.debug);
		},
	};

	function load(id, givenSource) {
		if (!givenSource && cache.has(id)) {
			return Promise.resolve(cache.get(id));
		}
		return Promise.resolve()
		.then(() => givenSource || new Promise((resolve, reject) => {
			fs.readFile(id, 'utf8', (error, data) => {
				if (error) {
					reject(error);
				} else {
					resolve(data);
				}
			});
		}))
		.then((source) => postcss(params.postcss || []).process(source, {from: id}))
		.then(({root}) => {
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
			return Promise.all(Array.from(dependencies).map(([name, target]) => {
				return load(path.join(path.dirname(id), target))
				.then((result) => {
					const {classNames: importedClassNames} = result;
					for (const className of Object.keys(importedClassNames)) {
						replacements.set(importedClassNames[className], `${name}.${className}`);
					}
				});
			}))
			.then(() => {
				root.walkRules((rule) => {
					const {selector} = rule;
					let replaceCount = 0;
					rule.selector = Array.from(replacements)
					.reduce((selector, [to, from]) => {
						return selector.split(from).join(`.${to}`);
					}, selector)
					.replace(/\.=?(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g, (match, className) => {
						if (match.startsWith('.=') || replacements.has(className)) {
							return `.${className}`;
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
				const result = {
					classNames,
					dependencies,
				};
				cache.set(id, result);
				return result;
			});
		});
	}

};
module.exports.Labeler = Labeler;
