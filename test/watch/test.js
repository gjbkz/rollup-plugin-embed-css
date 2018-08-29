const path = require('path');
const os = require('os');
const t = require('tap');
const rollup = require('rollup');
const afs = require('@nlib/afs');
const embedCSS = require('../..');
const {runCode} = require('../util.js');
t.test('watch', (t) => {
    let watcher;
    t.afterEach((done) => {
        if (watcher) {
            watcher.close();
        }
        watcher = null;
        done();
    });
    const formats = ['es', 'iife', 'umd'];
    for (const format of formats) {
        t.test(format, async (t) => {
            const directory = await afs.mkdtemp(path.join(os.tmpdir(), `-embedCSS-${format}-`));
            const input = path.join(directory, 'input.js');
            const cssFile = path.join(directory, 'style.css');
            const cssDest = path.join(directory, 'output.css');
            const jsDest = path.join(directory, 'output.js');
            await Promise.all([
                afs.writeFile(input, [
                    'import {classes, properties} from \'./style.css\';',
                    'global.results = {classes, properties};',
                ].join('\n')),
                afs.writeFile(cssFile, '.foo {--color: red}'),
            ]);
            watcher = rollup.watch({
                input,
                plugins: [
                    embedCSS({dest: cssDest}),
                ],
                output: {format, file: jsDest},
            });
            await new Promise((resolve, reject) => {
                const timer = setTimeout(() => reject(new Error('timeout')), 3000);
                const events = [];
                let count = 0;
                watcher.on('event', (event) => {
                    events.push(event);
                    switch (event.code) {
                    case 'FATAL':
                    case 'ERROR':
                        event.error.events = events;
                        reject(event.error);
                        break;
                    case 'END':
                        if (count === 0) {
                            new Promise((resolve) => setTimeout(resolve, 100))
                            .then(() => afs.writeFile(cssFile, '.foo {--color2: blue}'))
                            .catch(reject);
                        } else {
                            clearTimeout(timer);
                            resolve();
                        }
                        count++;
                        break;
                    default:
                    }
                });
            });
            const code = await afs.readFile(jsDest, 'utf8');
            const {results: {classes, properties}} = runCode(code);
            t.equal(properties.color2, 'blue');
            t.ok(classes.foo.endsWith('_style_css_foo'));
        });
    }
    t.end();
});
