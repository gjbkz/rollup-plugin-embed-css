const path = require('path');
const {rollup} = require('rollup');
const postcss = require('postcss');
const t = require('tap');
const embedCSS = require('..');
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
const compareCSS = (t, a, b) => Promise.all([a, b].map((css) => postcss().process(css, {from: undefined})))
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
	t.match(actualNodes, expectedNodes);
});

t.test('rollup-plugin-embed-css', (t) => {

	const projects = [];
	const formats = ['es', 'iife', 'amd', 'cjs', 'umd'];
	const options = [
		(project) => ({
			id: '00',
			base: project.path('src'),
			url(url, id) {
				if (!url.startsWith('.')) {
					return null;
				}
				return path.join(path.relative(project.path('src'), path.dirname(id)), url);
			},
		}),
		(project) => ({
			id: '01',
			base: project.root,
			url: (url) => new Promise(setImmediate).then(() => url),
		}),
		() => ({id: '02', mangle: true}),
	];

	t.test('load projects', () => loadProjects().then((loaded) => projects.push(...loaded)));

	t.test('test projects', (t) => {

		projects.forEach((project) => t.test(project.name, (t) => {
			t.test('cleanup project/output', () => rm(project.path('output')));
			options.forEach((gen) => {
				t.test(JSON.stringify(gen(project)), (t) => {
					formats.forEach((format) => t.test(`format: ${format}`, (t) => {
						t.test('embed', (t) => {
							const option = gen(project);
							const data = {expected: {}};
							t.test('rollup()', () => {
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
							t.test('bundle.generate()', () => {
								return data.bundle.generate({format}).then((result) => Object.assign(data, result));
							});
							t.test(`output ${format}.${option.id}.js`, () => {
								const copied = Object.assign({}, option);
								for (const key of ['id', 'roots', 'cache']) {
									delete copied[key];
								}
								if (copied.base) {
									copied.base = path.join('path-to-project-root', path.relative(project.root, copied.base));
								}
								return project.writeFile(`${format}.${option.id}.embed.js`, [
									'/*',
									JSON.stringify({
										format,
										options: copied,
									}, null, '\t'),
									'*/',
									data.code,
								].join('\n'));
							});
							t.test('run the generated code', (t) => {
								data.sandbox = createSandbox();
								runInNewContext(data.code, data.sandbox);
								t.end();
							});
							t.test(`load expected.${option.id}.json`, () => {
								return project.readFile(`expected.${option.id}.json`)
								.then((jsonString) => {
									data.expected.classNames = JSON.parse(`${jsonString}`);
								});
							});
							t.test('test class names', (t) => {
								t.match(data.sandbox.classNames, data.expected.classNames);
								t.end();
							});
							t.test(`load expected.${option.id}.css`, () => {
								return project.readFile(`expected.${option.id}.css`)
								.then((cssString) => {
									data.expected.css = `${cssString}`;
								});
							});
							t.test('test generated css', (t) => compareCSS(t, [...data.sandbox.objectURLList].map(([, css]) => css).join(''), data.expected.css));
							t.end();
						});
						t.test('dest', (t) => {
							const option = gen(project);
							const data = {expected: {}};
							option.dest = project.path('output', 'css-output', `${format}.${option.id}.css`);
							t.test('rollup()', () => {
								return rollup({
									input: project.path('src', 'input.js'),
									plugins: [embedCSS(option)],
								})
								.then((bundle) => {
									data.bundle = bundle;
								});
							});
							t.test('bundle.generate()', () => {
								return data.bundle.generate({format}).then((result) => Object.assign(data, result));
							});
							t.test(`output ${format}.${option.id}.js`, () => {
								const copied = Object.assign({}, option);
								for (const key of ['id', 'roots', 'cache']) {
									delete copied[key];
								}
								for (const key of ['base', 'dest']) {
									const value = copied[key];
									if (value) {
										copied[key] = path.join('path-to-project-root', path.relative(project.root, value));
									}
								}
								return project.writeFile(`${format}.${option.id}.js`, [
									'/*',
									JSON.stringify({
										format,
										options: copied,
									}, null, '\t'),
									'*/',
									data.code,
								].join('\n'));
							});
							t.test('run the generated code', (t) => {
								data.sandbox = createSandbox();
								runInNewContext(data.code, data.sandbox);
								t.end();
							});
							t.test(`load expected.${option.id}.json`, () => {
								return project.readFile(`expected.${option.id}.json`)
								.then((jsonString) => {
									data.expected.classNames = JSON.parse(`${jsonString}`);
								});
							});
							t.test('test class names', (t) => {
								t.match(data.sandbox.classNames, data.expected.classNames);
								t.end();
							});
							t.test(`load ${option.dest}`, () => {
								return project.readFile(option.dest)
								.then((cssString) => {
									data.css = `${cssString}`;
								});
							});
							t.test(`load expected.${option.id}.css`, () => {
								return project.readFile(`expected.${option.id}.css`)
								.then((cssString) => {
									data.expected.css = `${cssString}`;
								});
							});
							t.test('test generated css', (t) => compareCSS(t, data.css, data.expected.css));
							t.end();
						});
						t.end();
					}));
					t.end();
				});
			});
			t.end();
		}));
		t.end();

	});

	t.end();

});
