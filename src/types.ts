import * as esifycss from 'esifycss';
import * as rollup from 'rollup';

export interface IPluginOptions extends Omit<esifycss.ISessionOptions, 'css'> {
    exclude?: Array<string | RegExp> | string | RegExp,
    css?: boolean | string,
}

export interface IPluginCore {
    resolveId: rollup.ResolveIdHook,
    load: rollup.LoadHook,
    generateBundle: rollup.OutputPluginHooks['generateBundle'],
}
