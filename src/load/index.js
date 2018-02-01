const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const BigNumber = require('bignumber.js');
BigNumber.config({ALPHABET: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'});
module.exports = load;

function load(id, givenSource, params) {
	const {
		labeler,
		cache,
		roots,
		postcss: postcssOptions = [],
		debug,
	} = params;
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
	.then((source) => postcss(postcssOptions).process(source, {from: id}))
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
		return new Promise((resolve, reject) => {
			const queue = Array.from(dependencies);
			next();
			function next() {
				if (queue.length === 0) {
					resolve();
				}
				const [name, target] = queue.shift();
				load(path.join(path.dirname(id), target), undefined, params)
				.then((result) => {
					const {classNames: importedClassNames} = result;
					for (const className of Object.keys(importedClassNames)) {
						replacements.set(importedClassNames[className], `${name}.${className}`);
					}
					next();
				})
				.catch(reject);
			}
		})
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
					const label = labeler.label(`${id}${className}`);
					const newClassName = `_${new BigNumber(label).toString(62)}`;
					classNames[className] = newClassName;
					return `.${newClassName}`;
				});
				if (0 < replaceCount && debug) {
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
