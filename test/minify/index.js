const test = require('@nlib/test');
const fs = require('fs');
const path = require('path');
const {rollup} = require('rollup');
const promisify = require('@nlib/promisify');
const readFile = promisify(fs.readFile, fs);
const embedCSS = require('../..');
test('minify', (test) => {
	const params = {};
	test('bundle', () => {
		return rollup({
			input: path.join(__dirname, 'src', 'index.js'),
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
		return readFile(path.join(__dirname, 'expected', 'index.js'), 'utf8')
		.then((code) => {
			params.expected = code;
		});
	});
	test('test code', (test) => {
		test.lines(params.code, params.expected);
	});
});
