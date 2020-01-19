import * as esifycss from 'esifycss';
import * as rollup from 'rollup';
import {parseBundle} from './parseBundle';

export const updateBundleCSS = (
    bundle: rollup.OutputBundle,
    output: esifycss.ISessionOutput,
    context: rollup.PluginContext,
) => {
    const {chunks} = parseBundle(bundle);
    const cssList: Array<string> = [];
    for (const {chunk, cssRanges} of chunks) {
        if (0 < cssRanges.length) {
            let {code} = chunk;
            for (let index = cssRanges.length; index--;) {
                const range = cssRanges[index];
                cssList[index] = range.css;
                code = `${code.slice(0, range.start)}'ESIFYCSSPlugin${index}'${code.slice(range.end)}`;
            }
            let methodName = '';
            code = code.replace(
                /(\w+)\s*\(\s*\[\s*((?:,\s*)?'ESIFYCSSPlugin\d+')+\s*\]\s*\)\s*[;\r\n]+/g,
                (_match, method) => {
                    if (methodName) {
                        if (methodName !== method) {
                            throw new Error(`UnexpectedMethod: ${method} !== ${methodName}`);
                        }
                    } else {
                        methodName = method;
                    }
                    return '';
                },
            );
            if (!methodName) {
                throw new Error('NoMethodToAddStyles');
            }
            code = code.replace(new RegExp(`const\\s+${methodName}\\s*=.*?[;\\r\\n]+`), '');
            chunk.code = code;
        }
    }
    context.emitFile({
        type: 'asset',
        fileName: output.path,
        source: cssList.join('\n'),
    });
};

export const updateBundleScript = (
    bundle: rollup.OutputBundle,
): void => {
    const {chunks, tokens} = parseBundle(bundle);
    const identifier = esifycss.createOptimizedIdentifier(tokens);
    for (const {chunk, cssRanges} of chunks) {
        let code = esifycss.minifyCSSInScript(chunk.code, cssRanges, identifier);
        code = esifycss.setDictionary(code, identifier.idList);
        chunk.code = code;
    }
};
