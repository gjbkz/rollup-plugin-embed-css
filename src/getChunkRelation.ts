import type {IRollupChunkLike} from './types';

export const getChunkRelation = (
    c1: IRollupChunkLike,
    c2: IRollupChunkLike,
): -1 | 0 | 1 => {
    const {fileName: fileName2} = c2;
    if (c1.imports.includes(fileName2) || c1.dynamicImports.includes(fileName2)) {
        return 1;
    }
    const {fileName: fileName1} = c1;
    if (c2.imports.includes(fileName1) || c2.dynamicImports.includes(fileName1)) {
        return -1;
    }
    return 0;
};
