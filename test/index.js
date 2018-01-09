const test = require('@nlib/test');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const {rollup} = require('rollup');
const promisify = require('@nlib/promisify');
const readdir = promisify(fs.readdir, fs);
const readFile = promisify(fs.readFile, fs);
const embedCSS = require('..');
const testsDir = path.join(__dirname, 'tests');

test('rollup-plugin-embed-css', (test) => {

	const projectsDirectory = path.join(__dirname, 'projects');
	const projects = [];

	test('readdir', () => {
		return readdir(projectsDirectory)
		.then((names) => {
			projects.push(...names);
		});
	});

	test('test projects', (test) => {
		for (const name of projects) {
			test(name, (test) => {
				const directory = path.join(projectsDirectory, name);
				const params = {};

				test('bundle', () => {
					return rollup({
						input: path.join(directory, 'index.js'),
						plugins: [
							embedCSS({
								debug: true
							})
						]
					})
					.then((bundle) => {
						params.bundle = bundle;
					});
				});

				test('generate code', () => {
					return params.bundle.generate({
						format: 'cjs'
					})
					.then(({code}) => {
						params.code = code;
					});
				});

				test('run code', () => {
					const context = {result: {}};
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
