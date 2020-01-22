import test from 'ava';
import {IRollupChunkLike, IRollupAssetLike} from './types';
import {sortFileList} from './sortFileList';

const asset = (
    fileName: string,
): IRollupAssetLike => ({type: 'asset', fileName});

const chunk = (
    fileName: string,
    imports: Array<string> = [],
    dynamicImports: Array<string> = [],
): IRollupChunkLike => ({
    type: 'chunk',
    fileName,
    imports,
    dynamicImports,
});

test('isolated', (t) => {
    const m0 = asset('00');
    const m1 = chunk('01');
    const m2 = chunk('02');
    const m3 = asset('03');
    t.deepEqual(sortFileList([m0, m1, m2, m3]), [m0, m3, m1, m2]);
});

test('dependent', (t) => {
    const m0 = chunk('00', ['02']);
    const m1 = chunk('01');
    const m2 = chunk('02', ['01']);
    const m3 = asset('03');
    t.deepEqual(sortFileList([m0, m1, m2, m3]), [m3, m1, m2, m0]);
});

test('sort', (t) => {
    const m0 = asset('00');
    const m1 = chunk('01', [], ['02']);
    const m2 = chunk('02');
    const m3 = chunk('03', ['02'], ['01']);
    const m4 = chunk('04', ['03']);
    const m5 = chunk('05');
    const m6 = chunk('06', ['08']);
    const m7 = chunk('07');
    const m8 = chunk('08', [], ['07']);
    const m9 = asset('09');
    t.deepEqual(
        sortFileList([m0, m1, m2, m3, m4, m5, m6, m7, m8, m9]),
        [m9, m0, m7, m8, m6, m2, m1, m3, m4, m5],
    );
});
