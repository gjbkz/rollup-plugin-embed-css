const path = require('path');
const t = require('tap');
const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript2');
const embedCSS = require('../..');
const {runCode} = require('../util.js');
const sourceDirectory = __dirname;
t.test('typescript', (t) => {
    const formats = ['es', 'iife', 'umd'];
    const targets = ['esnext', 'es6'];
    for (const format of formats) {
        for (const target of targets) {
            for (const reverse of [true, false]) {
                t.test(JSON.stringify({format, target, reverse}), async (t) => {
                    const directory = sourceDirectory;
                    const input = path.join(directory, 'input.ts');
                    const cssDest = path.join(directory, 'output.css');
                    const plugins = [
                        typescript({
                            clean: true,
                            tsconfig: path.join(directory, 'tsconfig.json'),
                            tsconfigOverride: {target},
                        }),
                        embedCSS({dest: cssDest}),
                    ];
                    if (reverse) {
                        plugins.reverse();
                    }
                    const bundle = await rollup.rollup({
                        input,
                        plugins,
                    });
                    const result = await bundle.generate({
                        sourcemap: true,
                        format,
                    });
                    const {results} = runCode(result.code);
                    t.match(results, {
                        foo: 'foofoo',
                        bar: 'redred',
                        properties: {color: 'red'},
                    });
                });
            }
        }
    }
    t.end();
});
