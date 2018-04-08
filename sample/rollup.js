const path = require('path');
const console = require('console');
const writeFile = require('@nlib/write-file');
const {rollup} = require('rollup');
const embedCSS = require('..');

process.chdir(__dirname);

Promise.resolve()
.then(async () => {
	const bundle = await rollup({
		input: 'index.js',
		plugins: [embedCSS()],
	});
	const {code} = await bundle.generate({format: 'es'});
	return writeFile(path.join('results', 'default.js'), code);
})
.then(async () => {
	const bundle = await rollup({
		input: 'index.js',
		plugins: [embedCSS({mangle: true})],
	});
	const {code} = await bundle.generate({format: 'es'});
	return writeFile(path.join('results', 'mangle.js'), code);
})
.catch((error) => {
	console.error(error);
	process.exit(1);
});
