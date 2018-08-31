const path = require('path');
const os = require('os');
const t = require('tap');
const rollup = require('rollup');
const afs = require('@nlib/afs');
const embedCSS = require('../..');
const {runCode} = require('../util.js');
t.test('sourcemap', (t) => {
    const formats = ['es', 'iife', 'umd'];
    for (const format of formats) {
        for (const embed of [false, true]) {
            t.test(`${format} embed:${embed}`, async (t) => {
                const directory = await afs.mkdtemp(path.join(os.tmpdir(), `-embedCSS-${format}-`));
                await afs.cpr(__dirname, directory);
                const input = path.join(directory, 'input.js');
                const cssDest = embed ? undefined : path.join(directory, 'output.css');
                const bundle = await rollup.rollup({
                    input,
                    plugins: [embedCSS({dest: cssDest})],
                });
                const result = await bundle.generate({
                    sourcemap: true,
                    format,
                });
                const {results} = runCode(result.code);
                t.match(results, {
                    foo: 'foofoo',
                    properties: {color: 'red'},
                });
                t.ok(result.map.mappings.match(/[^;]/));
            });
        }
    }
    t.end();
});
