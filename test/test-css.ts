import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as rollup from 'rollup';
import {embedCSSPlugin} from '../src/embedCSSPlugin';
import {deleteFiles} from './deleteFiles';
import {run} from './run';

export const prepare = async (
    {directory, input}: {
        directory: string,
        input: string,
    },
) => {
    await fs.promises.writeFile(
        path.join(directory, 'index.html'),
        [
            '<!doctype html>',
            '<link rel="stylesheet" href="./esifycssOutput.css">',
            '<script src="./s.min.js"></script>',
            `<script>System.import('./${input}')</script>`,
        ].join('\n'),
    );
    await fs.promises.writeFile(
        path.join(directory, 's.min.js'),
        await fs.promises.readFile(require.resolve('systemjs/dist/s.min.js')),
    );
};

export const test = async () => {
    console.log('---------------- CSS');
    const directory = path.join(__dirname, 'output', 'css');
    await deleteFiles(directory);
    {
        const bundle = await rollup.rollup({
            input: [
                path.join(__dirname, 'src/input1.js'),
                path.join(__dirname, 'src/input2.js'),
            ],
            plugins: [embedCSSPlugin({
                css: true,
            })],
        });
        await bundle.write({format: 'system', dir: directory, sourcemap: true});
    }
    await prepare({directory, input: 'input1.js'});
    const result1 = await run(directory);
    assert.deepEqual(
        result1,
        {
            root1: 'Loaded',
            root2: 'Loaded',
            root3: 'Loaded',
            root4: 'Loaded',
            class1: '',
            class2: 'style2',
            class3: '',
            class4: 'style4',
        },
        `input1 returned unexpected result\n${JSON.stringify(result1, null, 2)}`,
    );
    await prepare({directory, input: 'input2.js'});
    const result2 = await run(directory);
    assert.deepEqual(
        result2,
        {
            root1: 'Loaded',
            root2: 'Loaded',
            root3: 'Loaded',
            root4: 'Loaded',
            class1: '',
            class2: '',
            class3: 'style3',
            class4: 'style4',
        },
        `input2 returned unexpected result\n${JSON.stringify(result2, null, 2)}`,
    );
};
