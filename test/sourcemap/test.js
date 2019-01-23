const path = require('path');
const t = require('tap');
const rollup = require('rollup');
const {cpr} = require('@nlib/afs');
const embedCSS = require('../..');
const {runCode, mktempdir} = require('../util.js');
t.test('sourcemap', (t) => {
    const formats = ['es', 'iife', 'umd'];
    for (const format of formats) {
        for (const embed of [false, true]) {
            t.test(`${format} embed:${embed}`, async (t) => {
                const directory = await mktempdir(format);
                await cpr(__dirname, directory);
                const input = path.join(directory, 'input.js');
                const cssDest = embed ? undefined : path.join(directory, 'output.css');
                const bundle = await rollup.rollup({
                    input,
                    plugins: [embedCSS({dest: cssDest})],
                });
                const {output: [{code, map}]} = await bundle.generate({
                    sourcemap: true,
                    format,
                });
                const {results} = runCode(code);
                t.match(results, {
                    foo: 'foofoo',
                    properties: {color: 'red'},
                });
                t.ok(map.mappings.match(/[^;]/));
            });
        }
    }
    t.end();
});
