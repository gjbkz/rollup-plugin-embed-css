const path = require('path');
const os = require('os');
const t = require('tap');
const rollup = require('rollup');
const postcss = require('postcss');
const afs = require('@nlib/afs');
const embedCSS = require('../..');
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
            const cssFile1 = path.join(directory, 'style-1.css');
            const cssFile2 = path.join(directory, 'style-2.css');
            const cssDest = path.join(directory, 'output.css');
            const jsDest = path.join(directory, 'output.js');
            await Promise.all([
                afs.writeFile(input, [
                    'import {classes, properties} from \'./style-1.css\';',
                    'global.results = {classes, properties};',
                ].join('\n')),
                afs.writeFile(cssFile1, '@import \'./style-2.css\';\n.foo {--color: red}'),
                afs.writeFile(cssFile2, '.bar {--color: blue}'),
            ]);
            watcher = rollup.watch({
                input,
                plugins: [
                    embedCSS({
                        dest: cssDest,
                        mangler: (id, className) => className,
                    }),
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
                            .then(() => afs.writeFile(cssFile2, '.bar {--color: green}'))
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
            const css = await afs.readFile(cssDest, 'utf8');
            const {nodes} = postcss.parse(css);
            t.equal(nodes.length, 2, 'nodes.length');
            t.match(nodes[0], {
                selector: '.bar',
                nodes: {
                    0: {
                        prop: '--color',
                        value: 'green',
                    },
                },
            });
            t.match(nodes[1], {
                selector: '.foo',
                nodes: {
                    0: {
                        prop: '--color',
                        value: 'red',
                    },
                },
            });
        });
    }
    t.end();
});
