const test = require('@nlib/test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {rollup} = require('rollup');
const loadProjects = require('../load-projects');
const promisify = require('@nlib/promisify');
const readFile = promisify(fs.readFile, fs);
const embedCSS = require('../..');
test('minify', (test) => {
	const projects = [];
	test('readdir', () => {
		return loadProjects(__dirname).then((names) => projects.push(...names));
	});
	test('test projects', (test) => {
		for (const name of projects) {
			const directory = path.join(__dirname, name);
			const params = {};
			test('bundle', () => {
				return rollup({
					input: path.join(directory, 'src', 'index.js'),
					plugins: [
						embedCSS(),
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
			test('load expected code', () => {
				return readFile(path.join(directory, 'expected.txt'), 'utf8')
				.then((code) => {
					params.expected = code;
				});
			});
			test('test code', () => {
				assert.equal(params.code.trim(), params.expected.trim());
			});
		}
	});
});
