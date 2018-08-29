const path = require('path');
const os = require('os');
const t = require('tap');
const rollup = require('rollup');
const afs = require('@nlib/afs');
const embedCSS = require('../..');
const {runCode} = require('../util.js');
const postcss = require('postcss');
t.test('simple-file', (t) => {
    const formats = ['es'];
    for (const format of formats) {
        t.test(format, async (t) => {
            const directory = await afs.mkdtemp(path.join(os.tmpdir(), `-embedCSS-${format}-`));
            await afs.cpr(__dirname, directory);
            const input = path.join(directory, 'input.js');
            const cssDest = path.join(directory, 'output.css');
            const bundle = await rollup.rollup({
                input,
                plugins: [
                    embedCSS({dest: cssDest}),
                ],
            });
            const result = await bundle.generate({
                sourceMap: true,
                format,
            });
            const {results: {classes, properties}} = runCode(result.code);
            t.ok(classes.foo.endsWith('_style_css_foo'), 'classes.foo');
            t.notOk(classes.bar, 'classes.bar');
            const ast = postcss.parse(await afs.readFile(cssDest, 'utf8'));
            let count = 0;
            ast.walkRules(({selector}) => {
                count += selector.includes(classes.foo);
            });
            t.ok(0 < count, 'classes.foo is used');
            t.equal(properties.color, 'red', `properties.color: ${properties.color}`);
        });
    }
    t.end();
});
