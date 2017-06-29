const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const {rollup} = require('rollup');
const promisify = require('j1/promisify');
const $console = require('j1/console').create('test');
const embedCSS = require('..');

async function runTests() {
	const testsDir = path.join(__dirname, 'tests');
	const tests = await promisify(fs.readdir, fs)(testsDir);
	const readFile = promisify(fs.readFile, fs);
	async function run() {
		const testName = tests.shift();
		if (!testName) {
			return;
		}
		const testDir = path.join(testsDir, testName);
		const console = $console.create(`${testName}`);
		console.info('bundle');
		const bundle = await rollup({
			entry: path.join(testDir, 'index.js'),
			plugins: [
				embedCSS({
					debug: true
				})
			]
		});
		console.info('generate code');
		const {code} = bundle.generate({
			format: 'cjs'
		});
		const context = {result: {}};
		vm.runInNewContext(code, context);
		console.info('load expected data');
		const expected = JSON.parse(await readFile(path.join(testDir, 'expected.json'), 'utf8'));
		console.info('test the result');
		assert.equal(context.result.css, expected.css);
		assert.deepEqual(context.result.style, expected.style);
		console.info('end');
		await run();
	}
	await run();
}

runTests()
.catch($console.onError);
