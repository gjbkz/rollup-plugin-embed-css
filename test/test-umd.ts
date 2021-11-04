import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as rollup from 'rollup';
import {embedCSSPlugin} from '../src/embedCSSPlugin';
import {deleteFiles} from './deleteFiles';
import {run} from './run';

export const test = async () => {
    console.log('---------------- UMD');
    const directory = path.join(__dirname, 'output', 'umd');
    await deleteFiles(directory);
    const bundle = await rollup.rollup({
        input: path.join(__dirname, 'src/input-sync.js'),
        plugins: [embedCSSPlugin()],
    });
    await bundle.write({
        format: 'iife',
        dir: directory,
        sourcemap: true,
    });
    await fs.promises.writeFile(
        path.join(directory, 'index.html'),
        [
            '<!doctype html>',
            '<script src="./input-sync.js" defer></script>',
        ].join('\n'),
    );
    const result = await run(directory);
    assert.deepEqual(
        result,
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
    );
};
