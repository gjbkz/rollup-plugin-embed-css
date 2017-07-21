const fs = require('fs');
const {rollup} = require('rollup');
const embedCSS = require('..');

process.chdir(__dirname);

Promise.resolve()
.then(async () => {
	const bundle = await rollup({
		entry: 'index.js',
		plugins: [embedCSS()]
	});
	const {code} = await bundle.generate({format: 'es'});
	fs.writeFileSync('result.js', code);
})
.catch((error) => {
	console.error(error);
	process.exit(1);
});
