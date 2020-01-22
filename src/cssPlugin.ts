import * as path from 'path';
import * as esifycss from 'esifycss';
import * as rollup from 'rollup';
import * as pluginUtils from 'rollup-pluginutils';
import {parseBundle} from './parseBundle';
import {IPluginCore} from './types';

const removeRange = (
    code: string,
    range: esifycss.IRange,
): string => `${code.slice(0, range.start)}${code.slice(range.end)}`;

export const cssPlugin = (
    session: esifycss.Session,
    filter: ReturnType<typeof pluginUtils.createFilter>,
): IPluginCore => ({
    resolveId: (importee, importer) => {
        const id = path.isAbsolute(importee) || !importer ? importee : path.join(path.dirname(importer), importee);
        return id === session.helperPath ? {id, external: true, moduleSideEffects: false} : null;
    },
    load: async (id) => filter(id) ? (await session.processCSS(id)).code : null,
    generateBundle(_options, bundle) {
        const history = new Map<string, rollup.EmittedAsset>();
        const lookupHistory = (key: string) => (history.get(key) || {source: ''}).source;
        parseBundle({
            bundle,
            cssKey: session.configuration.cssKey,
            helper: session.helperPath,
        }).chunks.forEach(({chunk, css}) => {
            chunk.code = [css.addStyle, ...css.statements]
            .sort((range1, range2) => range1.start < range2.start ? 1 : -1)
            .reduce(removeRange, chunk.code);
            const source = [
                css.ranges.map((range) => range.css).join('\n'),
                chunk.imports.map(lookupHistory).join('\n'),
                chunk.dynamicImports.map(lookupHistory).join('\n'),
            ].join('\n');
            const file: rollup.EmittedAsset = {
                type: 'asset',
                fileName: `${chunk.fileName}.css`,
                source,
            };
            history.set(chunk.fileName, file);
            this.emitFile(file);
        });
    },
});
