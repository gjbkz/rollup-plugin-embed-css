import * as path from 'path';
import * as esifycss from 'esifycss';
import * as pluginUtils from 'rollup-pluginutils';
import {IPluginCore} from './types';
import {parseBundle} from './parseBundle';

export const scriptPlugin = (
    session: esifycss.Session,
    filter: ReturnType<typeof pluginUtils.createFilter>,
): IPluginCore => ({
    resolveId(importee, importer) {
        const id = importer && !path.isAbsolute(importee) ? path.join(path.dirname(importer), importee) : importee;
        return id === session.configuration.output.path ? session.helperPath : null;
    },
    async load(id) {
        if (!filter(id)) {
            return null;
        }
        return (await session.processCSS(id)).code;
    },
    generateBundle(_options, bundle) {
        const {chunks, tokens} = parseBundle({
            bundle,
            cssKey: session.configuration.cssKey,
        });
        const identifier = esifycss.createOptimizedIdentifier(tokens);
        for (const {chunk, css} of chunks) {
            let code = esifycss.minifyCSSInScript(chunk.code, css.ranges, identifier);
            code = esifycss.setDictionary(code, identifier.idList);
            chunk.code = code;
        }
    },
});
