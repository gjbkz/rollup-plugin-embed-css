const path = require('path');
const os = require('os');
const t = require('tap');
const rollup = require('rollup');
const afs = require('@nlib/afs');
const embedCSS = require('../..');
const {runCode} = require('../util.js');
const postcss = require('postcss');
t.test('simple-file', (t) => {
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
                        onParse: (data) => {
                            t.ok(typeof data.id, 'string');
                            t.ok(typeof data.classes, 'object');
                            t.ok(typeof data.properties, 'object');
                        },
                    }),
                ],
            });
            const {output: [{code}]} = await bundle.generate({format});
            const {results: {classes, properties}} = runCode(code);
            t.equal(classes.equal, 'equal');
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
