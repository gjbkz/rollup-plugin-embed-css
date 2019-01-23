const path = require('path');
const t = require('tap');
const rollup = require('rollup');
const postcss = require('postcss');
const {cpr, mktempdir} = require('@nlib/afs');
const embedCSS = require('../..');
const {runCode} = require('../util.js');
t.test('embed', (t) => {
    const formats = ['es', 'iife', 'umd'];
    for (const format of formats) {
        t.test(format, async (t) => {
            const directory = await mktempdir(format);
            await cpr(__dirname, directory);
            const input = path.join(directory, 'input.js');
            const bundle = await rollup.rollup({
                input,
                plugins: [
                    embedCSS({generateCode: (css) => `document.head.appendChild(document.createElement('style')).textContent = ${JSON.stringify(css)};`}),
                ],
            });
            const {output: [{code}]} = await bundle.generate({format});
            const {results: {classes}, document} = runCode(code);
            t.ok(classes.foo.endsWith('_style_css_foo'), 'classes.foo');
            const ast = postcss.parse(document.head.children[0].textContent);
            t.match(ast.nodes[0], {
                type: 'rule',
                nodes: {
                    length: 1,
                    0: {
                        type: 'decl',
                        prop: 'color',
                        value: 'red',
                    },
                },
            });
            t.match(ast.nodes[1], {
                type: 'atrule',
                name: 'media',
                params: 'print',
                nodes: {
                    length: 1,
                    0: {
                        type: 'rule',
                        nodes: {
                            length: 1,
                            0: {
                                type: 'decl',
                                prop: 'color',
                                value: 'blue',
                            },
                        },
                    },
                },
            });
        });
    }
    t.end();
});
