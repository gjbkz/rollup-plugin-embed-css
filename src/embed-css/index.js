const path = require('path');
const {createFilter} = require('rollup-pluginutils');
const {Labeler} = require('../-labeler');
const {encodeString} = require('../encode-string');
const {generateCode} = require('../generate-code');
const {minify} = require('../minify');
const {load} = require('../load');

exports.embedCSS = function embedCSS(params = {}) {

	params.filter = createFilter(params.include || '**/*.css', params.exclude);
	params.roots = new Map();
	params.cache = new Map();
	if (!params.mangler) {
		if (params.mangle) {
			const labeler = new Labeler();
			params.mangler = (id, className) => labeler.label(`${id}/${className}`);
		} else {
			params.base = params.base || process.cwd();
			params.mangler = (id, className) => [
				(path.isAbsolute(id) ? path.relative(params.base, id) : id)
				.replace(/^(\w)/, '_$1').replace(/[^\w]+/g, '_'),
				className,
			].join('_');
		}
	}
	return {
		name: 'embed-css',
		transform(source, id) {
			if (!params.filter(id)) {
				return null;
			}
			return load(id, source, params)
			.then(({classNames, dependencies}) => ({
				code: [...dependencies]
				.map(([, target]) => `import '${target}';`)
				.concat(`export default ${JSON.stringify(classNames)};`)
				.join('\n'),
				map: {mappings: ''},
			}));
		},
		outro() {
			const labeler = new Labeler();
			const encodedRules = [];
			for (const [, root] of params.roots) {
				encodedRules.push(
					...(params.debug ? root : minify(root)).nodes
					.map((node) => encodeString(`${node}`, labeler))
				);
			}
			if (encodedRules.length === 0) {
				return null;
			}
			return generateCode(labeler, encodedRules, params);
		},
	};
};
