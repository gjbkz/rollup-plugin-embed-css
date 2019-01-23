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
                    embedCSS(),
                ],
            });
            const {output: [{code}]} = await bundle.generate({format});
            const {results: {classes}, blobs, document} = runCode(code);
            t.ok(classes.foo.endsWith('_style_css_foo'), 'classes.foo');
            t.equal(blobs.length, 1, 'blobs.length');
            t.equal(document.head.children.length, 1, 'head.children.length');
            t.equal(blobs[0].type, 'text/css', 'blobs[0].type');
            const ast = postcss.parse(blobs[0].data);
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
