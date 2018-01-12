const path = require('path');
const {createFilter} = require('rollup-pluginutils');
const Labeler = require('./-labeler');
const encodeString = require('./encode-string');
const generateCode = require('./generate-code');
const minify = require('./minify');
const load = require('./load');

module.exports = function plugin(params = {}) {

	params.filter = createFilter(params.include, params.exclude);
	params.labeler = params.labeler || new Labeler();
	params.roots = new Map();
	params.cache = new Map();

	return {
		name: 'embed-css',
		transform(source, id) {
			if (!params.filter(id) || path.extname(id) !== '.css') {
				return null;
			}
			return load(id, source, params)
			.then(({classNames, dependencies}) => {
				const code = [
					...Array.from(dependencies)
					.map(([, target]) => {
						return `import '${target}';`;
					}),
					`export default ${JSON.stringify(classNames, null, '\t')};`,
				].join('\n');
				return {
					code,
					map: {mappings: ''},
				};
			});
		},
		outro() {
			const labeler = new Labeler();
			const encodedRules = [];
			for (const [, root] of params.roots) {
				encodedRules.push(
					...(params.debug ? root : minify(root)).nodes
					.map((node) => {
						return encodeString(`${node}`, labeler);
					})
				);
			}
			// if (encodedRules.length === 0) {
			// 	return null;
			// }
			return generateCode(labeler, encodedRules, params.debug);
		},
	};
};
module.exports.Labeler = Labeler;
