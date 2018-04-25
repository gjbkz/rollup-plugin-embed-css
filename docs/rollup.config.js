const path = require('path');
const embedCSS = require('..');
const babel = require('rollup-plugin-babel');
const globImport = require('rollup-plugin-glob-import');
const importFromScope = require('rollup-plugin-import-from-scope');
const nested = require('postcss-nested');
const srcDirectory = path.join(__dirname, 'src');
const cp = require('@nlib/cp');
const plugins = () => [
	{
		resolveId(importee) {
			return importee.startsWith('//') ? path.join(srcDirectory, importee) : null;
		},
	},
	globImport(),
	importFromScope(),
	embedCSS({
		postcss: [nested()],
		url: (url, id) => {
			if (!url.startsWith('.')) {
				return url;
			}
			const src = path.join(path.dirname(id), url);
			const dest = path.join(__dirname, 'static', path.relative(srcDirectory, src));
			return cp(src, dest).then(() => `./${path.relative(__dirname, dest).split(path.sep).join('/')}`);
		},
	}),
	babel({
		presets: [
			[
				'env',
				{modules: false},
			],
		],
	}),
];
module.exports = [
	{
		input: path.join(__dirname, 'src', 'index', 'index.js'),
		plugins: plugins(),
		output: {
			file: path.join(__dirname, 'index.js'),
			format: 'iife',
		},
	},
];
