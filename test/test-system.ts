import * as path from 'path';
import * as rollup from 'rollup';
import * as assert from 'assert';
import * as afs from '@nlib/afs';
import {run} from './run';
import {embedCSSPlugin} from '../src/embedCSSPlugin';
import {ServerSet} from './servers';

export const prepare = async (
    {directory, input}: {
        directory: string,
        input: string,
    },
) => {
    await afs.deploy(
        directory,
        {
            'index.html': [
                '<!doctype html>',
                '<script src="./s.min.js"></script>',
                `<script>System.import('./${input}')</script>`,
            ].join('\n'),
            's.min.js': await afs.readFile(require.resolve('systemjs/dist/s.min.js')),
        },
    );
};

export const test = async (
    servers: ServerSet,
) => {
    const directory = path.join(__dirname, 'output', 'system');
    await afs.rmrf(directory);
    {
        const bundle = await rollup.rollup({
            input: [
                path.join(__dirname, 'src/input1.js'),
                path.join(__dirname, 'src/input2.js'),
            ],
            plugins: [embedCSSPlugin()],
        });
        await bundle.write({format: 'system', dir: directory, sourcemap: true});
    }
    await prepare({directory, input: 'input1.js'});
    const result1 = await run({directory, servers});
    assert.deepEqual(
        result1,
        {
            className: {
                element: '_f',
                element4: '_h',
            },
            id: {
                element: '_g',
                element4: '_i',
            },
            keyframes: {
                style4: '_j',
            },
            style1: 'Loaded',
            style2: 'Loaded',
            style3: '',
            style4: 'Loaded',
        },
    );
    await prepare({directory, input: 'input2.js'});
    const result2 = await run({directory, servers});
    assert.deepEqual(
        result2,
        {
            ...result1,
            style1: 'Loaded',
            style2: '',
            style3: 'Loaded',
            style4: 'Loaded',
        },
    );
};
