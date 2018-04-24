const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const {promisify} = require('@nlib/util');
const readFile = promisify(fs.readFile);
exports.load = load;

function load(id, givenSource, roots, cache, options) {
	if (!givenSource && cache.has(id)) {
		return Promise.resolve(cache.get(id));
	}
	return Promise.resolve()
	.then(() => givenSource || readFile(id, 'utf8'))
	.then((source) => postcss(options.postcss || []).process(source, {from: id}))
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
				load(path.join(path.dirname(id), target), undefined, roots, cache, options)
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
			const promises = [];
			root.walk((node) => {
				if (node.type === 'rule') {
					const {selector} = node;
					node.selector = Array.from(replacements)
					.reduce((selector, [to, from]) => selector.split(from).join(`.${to}`), selector)
					.replace(/\.=?(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g, (match, className) => {
						if (match.startsWith('.=') || replacements.has(className)) {
							return `.${className}`;
						}
						const newClassName = options.mangler(id, className);
						classNames[className] = newClassName;
						return `.${newClassName}`;
					});
				} else if (node.type === 'decl') {
					const urlList = node.value.match(/url\(\s*[^)\s]+\s*\)/g);
					if (urlList) {
						promises.push(...urlList.map((value) => {
							const url = value.replace(/url\(\s*([^)\s]+)\s*\)/, '$1');
							return Promise.resolve(options.url(url, id))
							.then((result) => {
								node.value = `url(${
									path.normalize(result || url)
									.replace(/\\/g, '/')
									.replace(/^([^/])/g, './$1')
								})`;
							});
						}));
					}
				}
			});
			return Promise.all(promises);
		})
		.then(() => {
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
