import * as esifycss from 'esifycss';
import * as rollup from 'rollup';
import {isOutputChunk} from './isOutputChunk';

export const updateBundle = (
    bundle: rollup.OutputBundle,
): void => {
    const tokens = new Map<string, number>();
    const chunks = Object.values(bundle)
    .filter(isOutputChunk)
    .map((chunk) => {
        const cssRanges = esifycss.extractCSSFromScript(chunk.code);
        for (const rule of cssRanges) {
            for (const token of esifycss.tokenizeString(rule.css)) {
                tokens.set(token, (tokens.get(token) || 0) + 1);
            }
        }
        return {
            chunk,
            cssRanges,
        };
    });
    const identifier = esifycss.createOptimizedIdentifier(tokens);
    for (const {chunk, cssRanges} of chunks) {
        let code = esifycss.minifyCSSInScript(chunk.code, cssRanges, identifier);
        code = esifycss.setDictionary(code, identifier.idList);
        chunk.code = code;
    }
};
