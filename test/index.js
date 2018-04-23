const {rollup} = require('rollup');
const postcss = require('postcss');
const embedCSS = require('..');
const test = require('@nlib/test');
const rm = require('@nlib/rm');
const {loadProjects} = require('./projects');
const {runInNewContext} = require('vm');
const createSandbox = () => {
	const document = new class Document {

		constructor() {
			this.documentElement = this.createElement('html');
			this.head = this.documentElement.appendChild(this.createElement('head'));
			this.body = this.documentElement.appendChild(this.createElement('body'));
		}

		createElement(tagName) {
			return {
				context: this,
				tagName,
				childNodes: [],
				appendChild(childNode) {
					this.childNodes.push(childNode);
					return childNode;
				},
				getAttribute(key) {
					return this[key];
				},
				setAttribute(key, value) {
					this[key] = value;
				},
			};
		}

	}();
	const sandbox = {
		get window() {
			return sandbox;
		},
		document,
		Blob: class Blob {

			constructor(arrayOfStrings) {
				return Buffer.from(arrayOfStrings.join(''));
			}

		},
		objectURLList: new Map(),
		URL: class URL {

			static createObjectURL(blob) {
				const objectURL = `blob://${sandbox.objectURLList.size}`;
				sandbox.objectURLList.set(objectURL, blob);
				return objectURL;
			}

			static revokeObjectURL(objectURL) {
				const blob = sandbox.objectURLList.get(objectURL);
				if (blob) {
					blob.revoked = true;
				}
			}

		},
		amd: {
			defined: new Map(),
			loaded: new Map(),
		},
		define: (id, dependencies, factory) => {
			if (typeof id !== 'string') {
				factory = dependencies;
				dependencies = id;
				id = '';
			}
			if (!Array.isArray(dependencies)) {
				factory = dependencies;
				dependencies = [];
			}
			factory();
		},
	};
	return sandbox;
};

test('rollup-plugin-embed-css', (test) => {

	const projects = [];
	const formats = ['es', 'iife', 'amd', 'cjs', 'umd'];
	const options = [
		(project) => ({id: '00', base: project.path('src')}),
		(project) => ({id: '01', base: project.root}),
		() => ({id: '02', mangle: true}),
	];

	test('load projects', () => loadProjects().then((loaded) => projects.push(...loaded)));

	test('test projects', (test) => {

		projects.forEach((project) => test(project.name, (test) => {
			test('cleanup project/output', () => rm(project.path('output')));
			options.forEach((gen) => {
				const option = gen(project);
				test(JSON.stringify(option), (test) => {
					formats.forEach((format) => test(`format: ${format}`, (test) => {
						const data = {
							expected: {},
						};
						test('rollup()', () => {
							return rollup({
								input: project.path('src', 'input.js'),
								plugins: [
									embedCSS(option),
								],
							})
							.then((bundle) => {
								data.bundle = bundle;
							});
						});
						test('bundle.generate()', () => {
							return data.bundle.generate({format})
							.then((result) => Object.assign(data, result));
						});
						test(`output ${format}.${option.id}.js`, () => project.writeFile(`${format}.${option.id}.js`, data.code));
						test('run the generated code', () => {
							data.sandbox = createSandbox();
							runInNewContext(data.code, data.sandbox);
						});
						test(`load expected.${option.id}.json`, () => {
							return project.readFile(`expected.${option.id}.json`)
							.then((jsonString) => {
								data.expected.classNames = JSON.parse(`${jsonString}`);
							});
						});
						test('test class names', (test) => {
							test.compare(data.sandbox.classNames, data.expected.classNames);
						});
						test(`load expected.${option.id}.css`, () => {
							return project.readFile(`expected.${option.id}.css`)
							.then((cssString) => {
								data.expected.css = `${cssString}`;
							});
						});
						test('test generated css', (test) => {
							return Promise.all(
								[
									[...data.sandbox.objectURLList].map(([, css]) => css).join(''),
									data.expected.css,
								]
								.map((css) => postcss().process(css))
							)
							.then(([{root: actual}, {root: expected}]) => {
								const filterNode = (node) => {
									node = Object.assign({}, node);
									for (const key of ['raws', 'parent', 'source', 'nodes', 'lastEach', 'indexes']) {
										delete node[key];
									}
									return node;
								};
								const actualNodes = [];
								actual.walk((node) => actualNodes.push(filterNode(node)));
								const expectedNodes = [];
								expected.walk((node) => expectedNodes.push(filterNode(node)));
								test.compare(actualNodes, expectedNodes);
							});
						});
					}));
				});
			});
		}));

	});

});
