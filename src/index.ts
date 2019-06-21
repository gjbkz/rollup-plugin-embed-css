import * as path from 'path';
import * as esifycss from 'esifycss';
import * as rollup from 'rollup';
import * as pluginUtils from 'rollup-pluginutils';

module.exports = (
    options: esifycss.ISessionOptions & {
        exclude: Array<string | RegExp> | string | RegExp | null,
    },
): rollup.Plugin => {
    const filter = pluginUtils.createFilter(options.include || './**/*.css', options.exclude);
    const session = new esifycss.Session({...options, include: [], watch: false});
    const helperScriptPromise = session.outputHelperScript();
    return {
        name: 'embedCSS',
        async resolveId(id, importer) {
            const filePath = importer ? path.join(path.dirname(importer), id) : id;
            if (!filter(filePath)) {
                return null;
            }
            await helperScriptPromise;
            await session.processCSS(filePath);
            return `${filePath}${session.configuration.ext}`;
        },
        async generateBundle(_options, bundle) {
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
        },
    };
};
