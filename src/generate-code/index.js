const [c1, c2, c3] = `(function (words, rules, link) {
	link.setAttribute('rel', 'stylesheet');
	link.setAttribute('href', URL.createObjectURL(
		new Blob(
			rules.map(function (rule) {
				return rule.map(function (index) {
					return words[index];
				}).join('');
			}),
			{type: 'text/css'}
		)
	));
	URL.revokeObjectURL(link.getAttribute('href'));
}(
	'WORDS',
	'RULES',
	document.head.appendChild(document.createElement('link'))
));
`.split(/'(?:WORDS|RULES)'/);
exports.generateCode = function generateCode(labeler, rules) {
	const words = [];
	for (const [word, index] of labeler) {
		words[index] = word;
	}
	return [c1, JSON.stringify(words), c2, JSON.stringify(rules), c3].join('');
};
