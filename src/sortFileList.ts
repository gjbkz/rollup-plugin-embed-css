import {IRollupChunkLike, IRollupAssetLike} from './types';
import {compareString} from './compareString';

export const sortFileList = (
    list: Array<IRollupChunkLike | IRollupAssetLike>,
): Array<IRollupChunkLike | IRollupAssetLike> => {
    const assets: Array<IRollupAssetLike> = [];
    const chunks: Array<IRollupChunkLike> = [];
    const rootChunks: Array<IRollupChunkLike> = [];
    for (const chunk of list) {
        // execute topological sort here
        if (chunk.type === 'asset') {
            assets.push(chunk);
        } else if (chunk.imports.length === 0 && chunk.dynamicImports.length === 0) {
            rootChunks.push(chunk);
        } else {
            chunks.push(chunk);
        }
    }
    return [
        ...assets.sort((a1, a2) => compareString(a1.fileName, a2.fileName)),
        ...chunks,
    ];
};
