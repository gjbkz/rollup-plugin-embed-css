import type * as esifycss from 'esifycss';
import type {FunctionPluginHooks, Plugin, PluginContext} from 'rollup';

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

type Async<T> = T extends ((...args: infer A) => infer S) ? ((this: PluginContext, ...args: A) => Promise<S> | S) : never;
export interface IPluginCore extends Omit<Plugin, 'name'> {
    resolveId: Async<FunctionPluginHooks['resolveId']>,
    load: Async<FunctionPluginHooks['load']>,
    generateBundle: Async<FunctionPluginHooks['generateBundle']>,
}
