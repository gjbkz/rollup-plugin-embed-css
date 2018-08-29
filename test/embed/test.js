const path = require('path');
const os = require('os');
const t = require('tap');
const rollup = require('rollup');
const postcss = require('postcss');
const afs = require('@nlib/afs');
const embedCSS = require('../..');
const {runCode} = require('../util.js');
t.test('embed', (t) => {
    const formats = ['es', 'iife', 'umd'];
    for (const format of formats) {
        t.test(format, async (t) => {
            const directory = await afs.mkdtemp(path.join(os.tmpdir(), `-embedCSS-${format}-`));
            await afs.cpr(__dirname, directory);
            const input = path.join(directory, 'input.js');
            const bundle = await rollup.rollup({
                input,
                plugins: [
                    embedCSS(),
                ],
            });
            const result = await bundle.generate({
                sourceMap: true,
                format,
            });
            const blobs = [];
            const objectURLs = new Map();
            const head = {
                children: [],
                appendChild(child) {
                    this.children.push(child);
                    return child;
                },
            };
            const {results: {classes}} = runCode(result.code, {
                Blob: class Blob {
                    constructor(data) {
                        this.data = data;
                        blobs.push(this);
                    }
                },
                document: {
                    createElement: (tag) => ({
                        tag,
                        attrs: {},
                        setAttribute(key, value) {
                            this.attrs[key] = value;
                        },
                        getAttribute(key) {
                            return this.attrs[key];
                        },
                    }),
                    head,
                },
                URL: {
                    createObjectURL(blob) {
                        const url = `_${objectURLs.size}`;
                        objectURLs.set(url, blob);
                        return url;
                    },
                    revokeObjectURL(url) {
                        const blob = objectURLs.get(url);
                        if (blob) {
                            blob.revoked = true;
                        }
                    },
                },
            });
            t.ok(classes.foo.endsWith('_style_css_foo'), 'classes.foo');
            t.equal(blobs.length, 1, 'blobs.length');
            t.equal(head.children.length, 1, 'head.children.length');
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
