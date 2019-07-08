import * as esifycss from 'esifycss';

export interface IPluginOptions extends esifycss.ISessionOptions {
    exclude?: Array<string | RegExp> | string | RegExp,
}
