import * as rollup from 'rollup';

export const isOutputChunk = (
    x: rollup.OutputAsset | rollup.OutputChunk,
): x is rollup.OutputChunk => 'code' in x;
