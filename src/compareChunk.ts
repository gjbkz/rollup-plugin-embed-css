import {IRollupChunkLike, IRollupAssetLike} from './types';
import {getChunkRelation} from './getChunkRelation';
import {compareString} from './compareString';

export const compareChunk = (
    c1: IRollupChunkLike | IRollupAssetLike,
    c2: IRollupChunkLike | IRollupAssetLike,
): -1 | 0 | 1 => {
    if (c1.type === 'chunk') {
        if (c2.type === 'chunk') {
            return getChunkRelation(c1, c2) || compareString(c1.fileName, c2.fileName);
        }
        return 1;
    }
    return c2.type === 'chunk' ? -1 : compareString(c1.fileName, c2.fileName);
};
