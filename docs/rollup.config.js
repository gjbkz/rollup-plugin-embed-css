const path = require('path');
const embedCSS = require('..');
const globImport = require('rollup-plugin-glob-import');

module.exports = {
	input: path.join(__dirname, 'components', 'index.js'),
	plugins: [
		globImport(),
		embedCSS(),
	],
	output: {
		file: path.join(__dirname, 'components', 'index.js'),
		format: 'es',
	},
};
