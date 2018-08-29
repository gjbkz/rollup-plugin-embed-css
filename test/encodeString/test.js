const t = require('tap');
const {encodeString, decodeString} = require('../..');
t.test('encodeString/decodeString', (t) => {
    t.test('sort', (t) => {
        const source = 'height:100px,width:100px,width-width';
        const {encoded, words} = encodeString(source);
        t.match(encoded, [5, 2, 3, 1, 4, 0, 2, 3, 1, 4, 0, 6, 0]);
        t.match(words, ['width', 'px', ':', '100', ',', 'height', '-']);
        t.equal(decodeString(encoded, words), source);
        t.end();
    });
    t.end();
});
