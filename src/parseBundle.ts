import * as path from 'path';
import * as esifycss from 'esifycss';
import * as rollup from 'rollup';
import {isOutputChunk} from './isOutputChunk';
import {IParseResult} from 'esifycss/lib/minifier/types';
import {compareChunk} from './compareChunk';

export const parseBundle = (
    props: {
        bundle: rollup.OutputBundle,
        cssKey: string,
        helper: string,
    },
) => {
    const tokens = new Map<string, number>();
    const chunks: Array<{chunk: rollup.OutputChunk, css: IParseResult}> = [];
    const directories = new Map<string, string>();
    for (const chunk of Object.values(props.bundle).sort(compareChunk)) {
        if (isOutputChunk(chunk)) {
            if (chunk.facadeModuleId) {
                directories.set(chunk.fileName, path.dirname(chunk.facadeModuleId));
            }
            const directory = directories.get(chunk.fileName);
            if (!directory) {
                throw new Error(`Unresolvable: ${chunk.fileName}`);
            }
            for (const dependency of [...chunk.imports, ...chunk.dynamicImports]) {
                if (dependency !== props.helper) {
                    const filePath = path.join(directory, dependency);
                    directories.set(path.basename(filePath), path.dirname(filePath));
                }
            }
            try {
                const css = esifycss.parseCSSModuleScript({
                    code: chunk.code,
                    cssKey: props.cssKey,
                    helper: path.relative(directory, props.helper),
                });
                for (const range of css.ranges) {
                    for (const token of esifycss.tokenizeString(range.css)) {
                        tokens.set(token, (tokens.get(token) || 0) + 1);
                    }
                }
                chunks.push({chunk, css});
            } catch (error) {
                // Skip
            }
        }
    }
    return {tokens, chunks};
};
