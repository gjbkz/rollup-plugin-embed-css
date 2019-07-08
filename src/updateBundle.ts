import * as esifycss from 'esifycss';
import * as rollup from 'rollup';

export const updateBundle = (
    bundle: rollup.OutputBundle,
): void => {
    for (const [, chunk] of Object.entries(bundle)) {
        let {code} = chunk;
        if (code) {
            const cssRanges = esifycss.extractCSSFromScript(code);
            const tokens = new Map<string, number>();
            for (const rule of cssRanges) {
                for (const token of esifycss.tokenizeString(rule.css)) {
                    tokens.set(token, (tokens.get(token) || 0) + 1);
                }
            }
            const identifier = esifycss.createOptimizedIdentifier(tokens);
            code = esifycss.minifyCSSInScript(code, cssRanges, identifier);
            code = esifycss.setDictionary(code, identifier.idList);
            chunk.code = code;
        }
    }
};
