(function (words, rules, sheet, i) {
	for (i = rules.length; i--;) {
		insert(decode(rules[i]));
	}
	function decode(indexes) {
		return indexes.map(function (index) {
			return words[index];
		}).join('');
	}
	function insert(decoded) {
		try {
			sheet.insertRule(decoded, 0);
		} catch (error) {
			console.info(error, decoded);
		}
	}
}(
	'WORDS',
	'RULES',
	document.head.appendChild(document.createElement('style')).sheet
));
