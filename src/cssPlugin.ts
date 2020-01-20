import * as esifycss from 'esifycss';
import * as rollup from 'rollup';
import * as pluginUtils from 'rollup-pluginutils';
import {parseBundle} from './parseBundle';
import {IPluginCore} from './types';

export const updateBundleCSS = (
    bundle: rollup.OutputBundle,
    context: rollup.PluginContext,
): string => {
    const {chunks} = parseBundle(bundle);
    const all: Array<string> = [];
    for (const {chunk, cssRanges} of chunks) {
        if (0 < cssRanges.length) {
            const cssList: Array<string> = [];
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
            const source = cssList.join('\n');
            all.push(source);
            context.emitFile({
                type: 'asset',
                fileName: `${chunk.fileName}.css`,
                source,
            });
        }
    }
    return all.join('\n');
};

export const cssPlugin = (
    session: esifycss.Session,
    filter: ReturnType<typeof pluginUtils.createFilter>,
): IPluginCore => ({
    resolveId: (importee) => importee === session.helperPath ? importee : null,
    async load(id) {
        if (id === session.helperPath) {
            return 'export const addStyle = (rules) => console.log(rules);';
        }
        if (!filter(id)) {
            return null;
        }
        return (await session.processCSS(id)).code;
    },
    generateBundle(_options, bundle) {
        const source = updateBundleCSS(bundle, this);
        this.emitFile({
            type: 'asset',
            fileName: session.configuration.output.path,
            source,
        });
    },
});
