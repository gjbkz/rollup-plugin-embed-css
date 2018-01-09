const fs = require('fs');
const path = require('path');
const source = fs.readFileSync(path.join(__dirname, 'source', 'index.js'), 'utf8');
module.exports = function generateCode(labeler, rules, debug) {
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
	: source
	.replace('\'WORDS\'', JSON.stringify(words))
	.replace('\'RULES\'', JSON.stringify(rules));
};
