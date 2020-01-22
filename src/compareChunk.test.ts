import test from 'ava';
import {IRollupChunkLike, IRollupAssetLike} from './types';
import {compareChunk} from './compareChunk';

interface ITest {
    left: IRollupChunkLike | IRollupAssetLike,
    right: IRollupChunkLike | IRollupAssetLike,
    expected: -1 | 0 | 1,
}

const stringify = (
    input: IRollupChunkLike | IRollupAssetLike,
): string => {
    if (input.type === 'asset') {
        return `${input.type}:${input.fileName}`;
    }
    return `${input.type}:${input.fileName}[${[...input.imports, ...input.dynamicImports].join(',')}]`;
};

([
    {
        left: {type: 'asset', fileName: '001'},
        right: {type: 'asset', fileName: '000'},
        expected: 1,
    },
    {
        left: {type: 'asset', fileName: '000'},
        right: {type: 'asset', fileName: '001'},
        expected: -1,
    },
    {
        left: {type: 'chunk', fileName: '000', imports: [], dynamicImports: []},
        right: {type: 'asset', fileName: '001'},
        expected: 1,
    },
    {
        left: {type: 'asset', fileName: '001'},
        right: {type: 'chunk', fileName: '000', imports: [], dynamicImports: []},
        expected: -1,
    },
    {
        left: {type: 'chunk', fileName: '000', imports: [], dynamicImports: []},
        right: {type: 'chunk', fileName: '001', imports: [], dynamicImports: []},
        expected: -1,
    },
    {
        left: {type: 'chunk', fileName: '001', imports: [], dynamicImports: []},
        right: {type: 'chunk', fileName: '000', imports: [], dynamicImports: []},
        expected: 1,
    },
    {
        left: {type: 'chunk', fileName: '000', imports: ['001'], dynamicImports: []},
        right: {type: 'chunk', fileName: '001', imports: [], dynamicImports: []},
        expected: 1,
    },
    {
        left: {type: 'chunk', fileName: '000', imports: [], dynamicImports: ['001']},
        right: {type: 'chunk', fileName: '001', imports: [], dynamicImports: []},
        expected: 1,
    },
    {
        left: {type: 'chunk', fileName: '000', imports: [], dynamicImports: []},
        right: {type: 'chunk', fileName: '001', imports: ['000'], dynamicImports: []},
        expected: -1,
    },
    {
        left: {type: 'chunk', fileName: '000', imports: [], dynamicImports: []},
        right: {type: 'chunk', fileName: '001', imports: [], dynamicImports: ['000']},
        expected: -1,
    },
] as Array<ITest>).forEach(({left, right, expected}, index) => {
    test(`#${index} ${stringify(left)} ${stringify(right)} → ${expected}`, (t) => {
        t.is(compareChunk(left, right), expected);
    });
});
