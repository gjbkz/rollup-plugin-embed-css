import * as path from 'path';
import {AcornNode} from 'rollup';
import * as esifycss from 'esifycss';
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
    async load(id) {
        if (filter(id)) {
            let {code} = await session.processCSS(id);
            const {body} = this.parse(code, {}) as unknown as {
                body: Array<AcornNode & {
                    source: {value: string},
                }>,
            };
            for (let {length: index} = body; 0 < index--;) {
                const node = body[index];
                if (node.type === 'ImportDeclaration') {
                    const source = path.join(path.dirname(id), node.source.value);
                    if (source === session.helperPath) {
                        code = removeRange(code, node);
                    }
                }
            }
            return code;
        }
        return null;
    },
    generateBundle(_options, bundle) {
        const cssList: Array<string> = [];
        parseBundle({
            bundle,
            cssKey: session.configuration.cssKey,
        }).chunks.forEach(({chunk, css}) => {
            chunk.code = css.statements
            .sort((range1, range2) => range1.start < range2.start ? 1 : -1)
            .reduce(removeRange, chunk.code);
            cssList.push(css.ranges.map((range) => range.css).join('\n').trim());
        });
        this.emitFile({
            type: 'asset',
            fileName: session.configuration.output.path,
            source: cssList.join('\n'),
        });
    },
});
