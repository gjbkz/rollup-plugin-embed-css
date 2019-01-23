const path = require('path');
const t = require('tap');
const rollup = require('rollup');
const postcss = require('postcss');
const {cpr, readFile} = require('@nlib/afs');
const {runCode, mktempdir} = require('../util.js');
const embedCSS = require('../..');
const nested = require('postcss-nested');
t.test('plugins', (t) => {
    const formats = ['es', 'iife', 'umd'];
    for (const format of formats) {
        t.test(format, async (t) => {
            const directory = await mktempdir(format);
            await cpr(__dirname, directory);
            const input = path.join(directory, 'input.js');
            const cssDest = path.join(directory, 'output.css');
            const bundle = await rollup.rollup({
                input,
                plugins: [
                    embedCSS({
                        dest: cssDest,
                        plugins: [nested],
                    }),
                ],
            });
            const {output: [{code}]} = await bundle.generate({format});
            const {results: {classes, properties}} = runCode(code);
            t.ok(classes.foo.endsWith('_style_css_foo'), 'classes.foo');
            t.ok(classes.bar.endsWith('_style_css_bar'), 'classes.bar');
            t.equal(properties.color1, 'red', `properties.color1: ${properties.color1}`);
            t.equal(properties.color2, 'blue', `properties.color2: ${properties.color2}`);
            const css = await readFile(cssDest, 'utf8');
            const ast = postcss.parse(css);
            t.equal(ast.nodes.length, 2, `ast.nodes.length: ${ast.nodes.length}`);
        });
    }
    t.end();
});
