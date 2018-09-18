const path = require('path');
const os = require('os');
const t = require('tap');
const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript2');
const afs = require('@nlib/afs');
const embedCSS = require('../..');
const {runCode} = require('../util.js');
t.test('typescript', (t) => {
    const formats = ['es'];
    const targets = ['esnext'];
    // const formats = ['es', 'iife', 'umd'];
    // const targets = ['esnext', 'es6'];
    for (const format of formats) {
        for (const target of targets) {
            t.test(`${format} target:${target}`, async (t) => {
                const directory = await afs.mkdtemp(path.join(os.tmpdir(), `-typescript-${format}-${target}-`));
                await afs.cpr(__dirname, directory);
                const input = path.join(directory, 'input.ts');
                const cssDest = path.join(directory, 'output.css');
                const bundle = await rollup.rollup({
                    input,
                    plugins: [
                        typescript({
                            tsconfigDefaults: {compilerOptions: {target}},
                        }),
                        embedCSS({dest: cssDest}),
                    ],
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
