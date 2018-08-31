const path = require('path');
const os = require('os');
const t = require('tap');
const rollup = require('rollup');
const postcss = require('postcss');
const afs = require('@nlib/afs');
const embedCSS = require('../..');
const {runCode} = require('../util.js');
const nested = require('postcss-nested');
t.test('plugins', (t) => {
    const formats = ['es', 'iife', 'umd'];
    for (const format of formats) {
        t.test(format, async (t) => {
            const directory = await afs.mkdtemp(path.join(os.tmpdir(), `-embedCSS-${format}-`));
            await afs.cpr(__dirname, directory);
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
            const result = await bundle.generate({format});
            const {results: {classes, properties}} = runCode(result.code);
            t.ok(classes.foo.endsWith('_style_css_foo'), 'classes.foo');
            t.ok(classes.bar.endsWith('_style_css_bar'), 'classes.bar');
            t.equal(properties.color1, 'red', `properties.color1: ${properties.color1}`);
            t.equal(properties.color2, 'blue', `properties.color2: ${properties.color2}`);
            const css = await afs.readFile(cssDest, 'utf8');
            const ast = postcss.parse(css);
            t.equal(ast.nodes.length, 2, `ast.nodes.length: ${ast.nodes.length}`);
        });
    }
    t.end();
});
