const path = require('path');
const t = require('tap');
const rollup = require('rollup');
const embedCSS = require('../..');
t.test('simple-file', (t) => {
    const formats = ['es'];
    for (const format of formats) {
        t.test(format, async () => {
            const input = path.join(__dirname, 'input.js');
            const bundle = await rollup.rollup({
                input,
                plugins: [
                    embedCSS(),
                ],
            });
            const result = await bundle.generate({
                sourceMap: true,
                format,
            });
            console.log(result);
        });
    }
    t.end();
});
