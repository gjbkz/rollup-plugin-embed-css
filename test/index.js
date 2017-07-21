async function test(run) {

	const assert = require('assert');
	const fs = require('fs');
	const path = require('path');
	const vm = require('vm');
	const {rollup} = require('rollup');
	const promisify = require('j1/promisify');
	const readdir = promisify(fs.readdir, fs);
	const readFile = promisify(fs.readFile, fs);
	const embedCSS = require('..');
	const testsDir = path.join(__dirname, 'tests');

	for (const testName of await readdir(testsDir)) {
		await run(testName, async (run) => {

			const testDir = path.join(testsDir, testName);
			const params = {};

			await run('bundle', async () => {
				params.bundle = await rollup({
					entry: path.join(testDir, 'index.js'),
					plugins: [
						embedCSS({
							debug: true
						})
					]
				});
			});

			await run('generate code', async () => {
				params.code = (await params.bundle.generate({
					format: 'cjs'
				})).code;
			});

			await run('run code', () => {
				params.result = {};
				vm.runInNewContext(params.code, {result: params.result});
			});

			await run('load expected data', async () => {
				params.expected = JSON.parse(await readFile(path.join(testDir, 'expected.json'), 'utf8'));
			});

			await run('test the result', async () => {
				const {result, expected} = params;
				assert.deepEqual(result.style, expected);
			});

			await run('load expected css', async () => {
				params.expectedCSS = (await readFile(path.join(testDir, 'expected.css'), 'utf8')).trim();
			});

			await run('test the result', async () => {
				const {result, expectedCSS} = params;
				assert.equal(result.css, expectedCSS);
			});

		});
	}

}

module.exports = test;
