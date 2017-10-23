function generateCode(labeler, rules, debug) {
	const words = [];
	for (const [word, index] of labeler) {
		words[index] = word;
	}
	return debug
	? `result.css = ${JSON.stringify(rules.map((indexes) => {
		return indexes.map((index) => {
			return words[index];
		}).join('');
	}).join('\n'))};`
	: `(function (words, rules) {
	var sheet = document.head.appendChild(document.createElement('style')).sheet;
	function decode(indexes) {
		return indexes.map(function (index) {
			return words[index];
		}).join('');
	}
	for (var i = rules.length; i--;) {
		var decoded = decode(rules[i]);
		try {
			sheet.insertRule(decoded, 0);
		} catch (error) {
			console.info(error, decoded);
		}
	}
}(
	${JSON.stringify(words)},
	${JSON.stringify(rules)}
));`;
}

module.exports = generateCode;
