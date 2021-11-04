import type * as esifycss from 'esifycss';
import type * as rollup from 'rollup';

export interface IRollupChunkLike {
    type: 'chunk',
    fileName: string,
    imports: Array<string>,
    dynamicImports: Array<string>,
}

export interface IRollupAssetLike {
    type: 'asset',
    fileName: string,
}

export interface IPluginOptions extends Omit<esifycss.SessionOptions, 'css'> {
    exclude?: Array<RegExp | string> | RegExp | string,
    css?: boolean | string,
}

export interface IPluginCore {
    resolveId: rollup.ResolveIdHook,
    load: rollup.LoadHook,
    generateBundle: rollup.OutputPluginHooks['generateBundle'],
}
