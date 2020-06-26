import * as path from 'path';
import * as rollup from 'rollup';
import * as assert from 'assert';
import * as afs from '@nlib/afs';
import {run} from './run';
import {embedCSSPlugin} from '../src/embedCSSPlugin';

export const test = async () => {
    console.log('---------------- IIFE');
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
