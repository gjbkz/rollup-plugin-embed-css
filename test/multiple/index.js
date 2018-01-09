const test = require('@nlib/test');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const {rollup} = require('rollup');
const promisify = require('@nlib/promisify');
const readdir = promisify(fs.readdir, fs);
const readFile = promisify(fs.readFile, fs);
const stat = promisify(fs.stat, fs);
const embedCSS = require('../..');
test('multiple', (test) => {
	const projects = [];
	test('readdir', () => {
		return readdir(__dirname)
		.then((names) => {
			return Promise.all(names.map((name) => stat(path.join(__dirname, name))))
			.then((results) => {
				projects.push(...names.filter((name, index) => results[index].isDirectory()));
			});
		});
	});
	test('test projects', (test) => {
		for (const name of projects) {
			test(name, (test) => {
				const labeler = new embedCSS.Labeler();
				const directory = path.join(__dirname, name);
				const params = {};
				test('get files', () => {
					return readdir(path.join(directory, 'src'))
					.then((names) => {
						params.files = names.filter((name) => name.endsWith('.js') && name !== 'result.js');
					});
				});
				test('bundle files', (test) => {
					for (const file of params.files) {
						test(file, (test) => {
							params[file] = {};
							test('bundle', () => {
								return rollup({
									input: path.join(directory, 'src', file),
									plugins: [
										embedCSS({debug: true, labeler}),
									],
								})
								.then((bundle) => {
									params[file].bundle = bundle;
								});
							});
							test('generate code', () => {
								return params[file].bundle.generate({format: 'es'})
								.then(({code}) => {
									params[file].code = code;
								});
							});
							test('run code', () => {
								const context = {};
								vm.runInNewContext(params[file].code, context);
								params[file].result = context.result;
							});
							test('load expected data', () => {
								return readFile(path.join(directory, `expected.${file}.json`), 'utf8')
								.then((json) => {
									params[file].expected = JSON.parse(json);
								});
							});
							test('test the result', (test) => {
								const {result, expected} = params[file];
								test.object(result.style, expected);
							});
							test('load expected css', () => {
								return readFile(path.join(directory, `expected.${file}.css`), 'utf8')
								.then((css) => {
									params[file].expectedCSS = css.trim();
								});
							});
							test('test the result', (test) => {
								const {result, expectedCSS} = params[file];
								test.lines(result.css, expectedCSS);
							});
						});
					}
				});
			});
		}
	});
});
