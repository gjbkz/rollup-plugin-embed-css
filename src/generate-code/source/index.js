(function (words, rules, link) {
	link.setAttribute('rel', 'stylesheet');
	link.setAttribute('href', URL.createObjectURL(new Blob(rules.map(function (rule) {
		return rule.map(function (index) {
			return words[index];
		}).join(';');
	}))));
	URL.revokeObjectURL(link.getAttribute('href'));
}(
	'WORDS',
	'RULES',
	document.head.appendChild(document.createElement('link'))
));
