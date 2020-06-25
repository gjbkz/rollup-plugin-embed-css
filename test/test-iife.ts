import * as path from 'path';
import * as rollup from 'rollup';
import * as assert from 'assert';
import * as afs from '@nlib/afs';
import {run} from './run';
import {embedCSSPlugin} from '../src/embedCSSPlugin';
import {ServerSet} from './servers';

export const test = async (
    servers: ServerSet,
) => {
    const directory = path.join(__dirname, 'output', 'iife');
    await afs.rmrf(directory);
    const bundle = await rollup.rollup({
        input: path.join(__dirname, 'src/input-sync.js'),
        plugins: [embedCSSPlugin()],
    });
    await bundle.write({
        format: 'iife',
        dir: directory,
        sourcemap: true,
    });
    await afs.deploy(
        directory,
        {
            'index.html': [
                '<!doctype html>',
                '<script src="./input-sync.js" defer></script>',
            ].join('\n'),
        },
    );
    const result = await run({directory, servers});
    assert.deepEqual(
        result,
        {
            className: {
                element: '_5',
                element2: '_7',
            },
            id: {
                element: '_6',
                element2: '_8',
            },
            keyframes: {
                style2: '_9',
            },
            style1: 'Loaded',
            style2: 'Loaded',
            style3: '',
            style4: 'Loaded',
        },
    );
};
