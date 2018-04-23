const fs = require('fs');
const path = require('path');
const source = fs.readFileSync(path.join(__dirname, 'source', 'index.js'), 'utf8');
exports.generateCode = function generateCode(labeler, rules) {
	const words = [];
	for (const [word, index] of labeler) {
		words[index] = word;
	}
	return source
	.replace('\'WORDS\'', JSON.stringify(words))
	.replace('\'RULES\'', JSON.stringify(rules));
};
