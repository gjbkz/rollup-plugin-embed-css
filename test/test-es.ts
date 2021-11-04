import * as fs from 'fs';
import * as assert from 'assert';
import * as path from 'path';
import * as rollup from 'rollup';
import {embedCSSPlugin} from '../src/embedCSSPlugin';
import {deleteFiles} from './deleteFiles';
import {commonjs} from './plugins';
import {run} from './run';
import {deployFiles} from './deployFiles';

const prepare = async (
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
    await deployFiles(output, {
        'index.html': [
            '<!doctype html>',
            '<script src="./s.min.js"></script>',
            `<script>System.import('./${input}')</script>`,
        ].join('\n'),
        's.min.js': await fs.promises.readFile(require.resolve('systemjs/dist/s.min.js')),
    });
};

export const test = async () => {
    console.log('---------------- ES');
    const directory = path.join(__dirname, 'output', 'es');
    await deleteFiles(directory);
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
    const result1 = await run(output1);
    assert.deepEqual(
        result1,
        {
            root1: 'Loaded',
            root2: 'Loaded',
            root3: '',
            root4: 'Loaded',
            class1: '',
            class2: 'style2',
            class3: '',
            class4: 'style4',
        },
        `input1 returned unexpected result\n${JSON.stringify(result1, null, 2)}`,
    );
    const output2 = path.join(directory, 'input2');
    await prepare({directory, input: 'input2.js', output: output2});
    const result2 = await run(output2);
    assert.deepEqual(
        result2,
        {
            root1: 'Loaded',
            root2: '',
            root3: 'Loaded',
            root4: 'Loaded',
            class1: '',
            class2: '',
            class3: 'style3',
            class4: 'style4',
        },
        `input1 returned unexpected result\n${JSON.stringify(result1, null, 2)}`,
    );
};
