const path = require('path');
const t = require('tap');
const rollup = require('rollup');
const {cpr, readFile} = require('@nlib/afs');
const {runCode, mktempdir} = require('../util.js');
const embedCSS = require('../..');
const postcss = require('postcss');
t.test('simple-file', (t) => {
    const formats = ['es'];
    // const formats = ['es', 'iife', 'umd'];
    for (const format of formats) {
        t.test(format, async (t) => {
            const directory = await mktempdir(format);
            await cpr(__dirname, directory);
            const input = path.join(directory, 'input.js');
            const cssDest = path.join(directory, 'output.css');
            process.chdir(directory);
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
            const {results: {className}} = runCode(code);
            t.equal(className.equal, 'equal');
            t.ok(className.foo.endsWith('_style_css_foo'), 'classes.foo');
            t.notOk(className.bar, 'classes.bar');
            const ast = postcss.parse(await readFile(cssDest, 'utf8'));
            let count = 0;
            ast.walkRules(({selector}) => {
                count += selector.includes(className.foo);
            });
            t.ok(0 < count, 'classes.foo is used');
        });
    }
    t.end();
});
