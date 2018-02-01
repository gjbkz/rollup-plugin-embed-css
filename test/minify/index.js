const test = require('@nlib/test');
const fs = require('fs');
const path = require('path');
const {rollup} = require('rollup');
const loadProjects = require('../load-projects');
const promisify = require('@nlib/promisify');
const readFile = promisify(fs.readFile, fs);
const embedCSS = require('../..');
test('minify', (test) => {
	const projects = [];
	test('readdir', () => loadProjects(__dirname).then((names) => projects.push(...names)));
	test('test projects', (test) => {
		for (const name of projects) {
			test(name, (test) => {
				const directory = path.join(__dirname, name);
				const results = {};
				test('bundle', () => {
					return rollup({
						input: path.join(directory, 'src', 'index.js'),
						plugins: [embedCSS()],
					})
					.then((bundle) => Object.assign(results, {bundle}));
				});
				test('generate code', () => {
					return results.bundle.generate({format: 'es'})
					.then(({code: generatedCode}) => Object.assign(results, {generatedCode}));
				});
				test('load expected code', () => {
					return readFile(path.join(directory, 'expected.txt'), 'utf8')
					.then((expectedCode) => Object.assign(results, {expectedCode}));
				});
				test('compare the code', (test) => test.compare(results.generatedCode.trim(), results.expectedCode.trim()));
			});
		}
	});
});
