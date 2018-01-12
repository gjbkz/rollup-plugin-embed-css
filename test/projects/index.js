const test = require('@nlib/test');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const {rollup} = require('rollup');
const loadProjects = require('../load-projects');
const promisify = require('@nlib/promisify');
const readFile = promisify(fs.readFile, fs);
const embedCSS = require('../..');

test('projects', (test) => {
	const projects = [];
	test('readdir', () => {
		return loadProjects(__dirname).then((names) => projects.push(...names));
	});
	test('test projects', (test) => {
		for (const name of projects) {
			test(name, (test) => {
				const directory = path.join(__dirname, name);
				const params = {};
				test('bundle', () => {
					return rollup({
						input: path.join(directory, 'src', 'index.js'),
						plugins: [
							embedCSS({debug: true}),
						],
					})
					.then((bundle) => {
						params.bundle = bundle;
					});
				});
				test('generate code', () => {
					return params.bundle.generate({format: 'es'})
					.then(({code}) => {
						params.code = code;
					});
				});
				test('run code', () => {
					const context = {};
					vm.runInNewContext(params.code, context);
					params.result = context.result;
				});
				test('load expected data', () => {
					return readFile(path.join(directory, 'expected.json'), 'utf8')
					.then((json) => {
						params.expected = JSON.parse(json);
					});
				});
				test('test the result', (test) => {
					const {result, expected} = params;
					test.object(result.style, expected);
				});
				test('load expected css', () => {
					return readFile(path.join(directory, 'expected.css'), 'utf8')
					.then((css) => {
						params.expectedCSS = css.trim();
					});
				});
				test('test the result', (test) => {
					const {result, expectedCSS} = params;
					test.lines(result.css, expectedCSS);
				});
			});
		}
	});
});
