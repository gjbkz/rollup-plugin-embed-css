function generateCode(words, rules, debug) {
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
		sheet.insertRule(decode(rules[i]), 0);
	}
}(
	${JSON.stringify(words)},
	${JSON.stringify(rules)}
));`;
}

module.exports = generateCode;
