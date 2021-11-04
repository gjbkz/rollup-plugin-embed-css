import * as esifycss from 'esifycss';
import type * as rollup from 'rollup';
import type {ParseResult} from 'esifycss/lib/minifier/types';

export const parseBundle = (
    {bundle, cssKey}: {
        bundle: rollup.OutputBundle,
        cssKey: string,
    },
) => {
    const tokens = new Map<string, number>();
    const chunks: Array<{chunk: rollup.OutputChunk, css: ParseResult}> = [];
    const processed = new WeakSet<rollup.OutputChunk>();
    const process = (
        chunkOrName: rollup.OutputAsset | rollup.OutputChunk | string,
    ) => {
        const chunk = typeof chunkOrName === 'string' ? bundle[chunkOrName] : chunkOrName;
        if (typeof chunk === 'undefined' || chunk.type === 'asset' || processed.has(chunk)) {
            return;
        }
        processed.add(chunk);
        chunk.imports.forEach(process);
        chunk.dynamicImports.forEach(process);
        const css = esifycss.parseCSSModuleScript({code: chunk.code, cssKey});
        for (const range of css.ranges) {
            for (const token of esifycss.tokenizeString(range.css)) {
                tokens.set(token, (tokens.get(token) || 0) + 1);
            }
        }
        chunks.push({chunk, css});
    };
    Object.values(bundle).forEach(process);
    return {tokens, chunks};
};
