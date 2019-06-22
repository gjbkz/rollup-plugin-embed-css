import * as path from 'path';
import * as esifycss from 'esifycss';
import * as rollup from 'rollup';
import * as pluginUtils from 'rollup-pluginutils';

interface IPluginOptions extends esifycss.ISessionOptions {
    exclude?: Array<string | RegExp> | string | RegExp,
}

const getFirstInput = (
    input: rollup.InputOptions['input'],
): string | null => {
    if (typeof input === 'string') {
        return input;
    } else if (Array.isArray(input)) {
        return input[0] || null;
    } else if (typeof input === 'object') {
        return input[Object.keys(input)[0]] || null;
    }
    return null;
};

export default (
    options: IPluginOptions = {},
): rollup.Plugin => {
    const filter = pluginUtils.createFilter(
        options.include || './**/*.css',
        options.exclude,
    );
    let session: esifycss.Session | undefined;
    let helperScriptPromise: Promise<void> | undefined;
    return {
        name: 'embedCSS',
        options(inputOptions) {
            if (!options.helper) {
                const firstInput = getFirstInput(inputOptions.input);
                if (firstInput) {
                    options.helper = path.join(path.dirname(firstInput), 'embedcss-helper.css.js');
                }
            }
            session = new esifycss.Session({...options, include: [], watch: false});
            helperScriptPromise = session.outputHelperScript();
            return null;
        },
        async resolveId(id, importer) {
            if (!session) {
                throw new Error(`session is ${session}`);
            }
            if (!helperScriptPromise) {
                throw new Error(`helperScriptPromise is ${helperScriptPromise}`);
            }
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
