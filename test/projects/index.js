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
	test('readdir', () => loadProjects(__dirname).then((names) => projects.push(...names)));
	test('test projects', (test) => {
		for (const name of projects) {
			test(name, (test) => {
				const directory = path.join(__dirname, name);
				const results = {};
				test('bundle', () => {
					return rollup({
						input: path.join(directory, 'src', 'index.js'),
						plugins: [embedCSS({debug: true})],
					})
					.then((bundle) => Object.assign(results, {bundle}));
				});
				test('generate code', () => {
					return results.bundle.generate({format: 'es'})
					.then(({code: generatedCode}) => Object.assign(results, {generatedCode}));
				});
				test('run code', () => {
					vm.runInNewContext(results.generatedCode, {global: results});
				});
				test('load expected data', () => {
					return readFile(path.join(directory, 'expected.json'), 'utf8')
					.then((json) => Object.assign(results, {expected: JSON.parse(json)}));
				});
				test('test the result', (test) => test.compare(results.style, results.expected));
				test('load expected css', () => {
					return readFile(path.join(directory, 'expected.css'), 'utf8')
					.then((css) => Object.assign(results, {expectedCSS: css.trim()}));
				});
				test('compare the css texts', (test) => test.compare(results.css, results.expectedCSS));
			});
		}
	});
});
