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
            await afs.cpr(path.join(__dirname, '../simple-file'), directory);
            const input = path.join(directory, 'input.js');
            const cssDest = path.join(directory, 'output.css');
            const labeler = new Map();
            const bundle = await rollup.rollup({
                input,
                plugins: [
                    embedCSS({
                        dest: cssDest,
                        mangler: (id, className) => {
                            const classId = `${className}/${id}`;
                            if (!labeler.has(classId)) {
                                labeler.set(classId, `_${labeler.size.toString(36)}`);
                            }
                            return labeler.get(classId);
                        },
                    }),
                ],
            });
            const result = await bundle.generate({
                sourceMap: true,
                format,
            });
            const {results: {classes, properties}} = runCode(result.code);
            for (const [id, mangled] of labeler) {
                if (id.endsWith('style-1.css')) {
                    t.equal(mangled, '_0', 'style-1.css');
                } else if (id.endsWith('style-2.css')) {
                    t.equal(mangled, '_1', 'style-2.css');
                } else if (id.endsWith('style.css')) {
                    t.equal(mangled, '_2', 'style.css');
                } else {
                    throw new Error(`Unknown id: ${id}`);
                }
            }
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
