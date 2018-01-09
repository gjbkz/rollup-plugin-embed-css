const {Labeler} = require('../Labeler');

function encodeString(string, labeler = new Labeler()) {
	let pos = 0;
	const labels = [];
	string.replace(/[^\w]|px/g, (match, index, source) => {
		if (pos < index) {
			labels.push(labeler.label(source.slice(pos, index)));
		}
		labels.push(labeler.label(match));
		pos = index + match.length;
	});
	return labels;
}

module.exports = encodeString;
