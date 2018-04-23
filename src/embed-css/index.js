const path = require('path');
const {createFilter} = require('rollup-pluginutils');
const MagicString = require('magic-string');
const {Labeler} = require('../-labeler');
const {encodeString} = require('../encode-string');
const {generateCode} = require('../generate-code');
const {minify} = require('../minify');
const {load} = require('../load');

exports.embedCSS = function embedCSS(options = {}) {

	const roots = new Map();
	const cache = new Map();
	options.filter = createFilter(options.include || '**/*.css', options.exclude);
	if (!options.mangler) {
		if (options.mangle) {
			const labeler = options.labeler || new Labeler();
			options.mangler = (id, className) => `_${labeler.label(`${id}/${className}`)}`;
		} else {
			options.base = options.base || process.cwd();
			options.mangler = (id, className) => [
				path.relative(options.base, id).replace(/^(\w)/, '_$1').replace(/[^\w]+/g, '_'),
				className,
			].join('_');
		}
	}
	return {
		name: 'embed-css',
		transform(source, id) {
			if (!options.filter(id)) {
				return null;
			}
			return load(id, source, roots, cache, options)
			.then(({classNames, dependencies}) => ({
				code: [...dependencies]
				.map(([, target]) => `import '${target}';`)
				.concat(`export default ${JSON.stringify(classNames)};`)
				.join('\n'),
				map: {mappings: ''},
			}));
		},
		transformBundle(source) {
			const labeler = new Labeler();
			const encodedRules = [];
			for (const [, root] of roots) {
				encodedRules.push(...minify(root).nodes.map((node) => encodeString(`${node}`, labeler)));
			}
			if (encodedRules.length === 0) {
				return null;
			}
			const s = new MagicString(source);
			s.prepend(generateCode(labeler, encodedRules));
			return {
				code: s.toString(),
				map: s.generateMap(),
			};
		},
	};
};
