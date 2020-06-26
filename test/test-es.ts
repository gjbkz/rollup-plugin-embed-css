import * as path from 'path';
import * as rollup from 'rollup';
import * as assert from 'assert';
import * as afs from '@nlib/afs';
import {commonjs} from './plugins';
import {run} from './run';
import {embedCSSPlugin} from '../src/embedCSSPlugin';
import {ServerSet} from './servers';

export const prepare = async (
    {directory, input, output}: {
        directory: string,
        input: string,
        output: string,
    },
) => {
    const bundle = await rollup.rollup({
        input: path.join(directory, input),
        plugins: [commonjs()],
        preserveEntrySignatures: 'strict',
    });
    await bundle.write({
        format: 'system',
        dir: output,
    });
    await afs.deploy(
        output,
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
    console.log('---------------- ES');
    const directory = path.join(__dirname, 'output', 'es');
    await afs.rmrf(directory);
    {
        const bundle = await rollup.rollup({
            input: [
                path.join(__dirname, 'src/input1.js'),
                path.join(__dirname, 'src/input2.js'),
            ],
            plugins: [embedCSSPlugin()],
        });
        await bundle.write({format: 'es', dir: directory, sourcemap: true});
    }
    const output1 = path.join(directory, 'input1');
    await prepare({directory, input: 'input1.js', output: output1});
    const result1 = await run({directory: output1, servers});
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
    const output2 = path.join(directory, 'input2');
    await prepare({directory, input: 'input2.js', output: output2});
    const result2 = await run({directory: output2, servers});
    assert.deepEqual(
        result2,
        {...result1, style2: '', style3: 'Loaded'},
    );
};
