import * as esifycss from 'esifycss';

export interface IPluginOptions extends Omit<esifycss.ISessionOptions, 'css'> {
    exclude?: Array<string | RegExp> | string | RegExp,
    css?: boolean | string,
}
