const fs = require('fs');
const path = require('path');
const source = fs.readFileSync(path.join(__dirname, 'source', 'index.js'), 'utf8');
module.exports = function generateCode(labeler, rules, {debug = false} = {}) {
	const words = [];
	for (const [word, index] of labeler) {
		words[index] = word;
	}
	return debug
	? `global.css = ${JSON.stringify(rules.map((indexes) => indexes.map((index) => words[index]).join('')).join('\n'))};`
	: source
	.replace('\'WORDS\'', JSON.stringify(words))
	.replace('\'RULES\'', JSON.stringify(rules));
};
