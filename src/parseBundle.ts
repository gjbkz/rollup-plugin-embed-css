import * as path from 'path';
import * as esifycss from 'esifycss';
import * as rollup from 'rollup';
import {IParseResult} from 'esifycss/lib/minifier/types';
import {DirectoryStore} from './DirectoryStore';

export const parseBundle = (
    props: {
        bundle: rollup.OutputBundle,
        cssKey: string,
        helper: string,
    },
) => {
    const tokens = new Map<string, number>();
    const chunks: Array<{chunk: rollup.OutputChunk, css: IParseResult}> = [];
    const processed = new WeakSet<rollup.OutputChunk>();
    const directories = new DirectoryStore();
    const process = (
        chunkOrName: rollup.OutputAsset | rollup.OutputChunk | string,
    ) => {
        if (chunkOrName === props.helper) {
            return;
        }
        const chunk = typeof chunkOrName === 'string' ? props.bundle[chunkOrName] : chunkOrName;
        if (typeof chunk === 'undefined') {
            throw new Error(`NoChunk: ${chunkOrName}`);
        }
        if (chunk.type === 'asset' || processed.has(chunk)) {
            return;
        }
        processed.add(chunk);
        const directory = directories.getDirectory(chunk, [props.helper]);
        chunk.imports.forEach(process);
        chunk.dynamicImports.forEach(process);
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
    };
    Object.values(props.bundle).forEach(process);
    return {tokens, chunks};
};
