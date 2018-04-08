exports.minify = function minify(node) {
	const {raws, nodes = []} = node;
	for (const key of ['before', 'between', 'after']) {
		const value = raws[key];
		if (value) {
			raws[key] = value.replace(/\s/g, '');
		}
	}
	for (const childNode of nodes) {
		minify(childNode);
	}
	return node;
};
