import {IPluginCore} from './types';

export const defaultPlugin = (): IPluginCore => {
    const throwError = () => {
        throw new Error('NoSession');
    };
    return {
        resolveId: throwError,
        load: throwError,
        generateBundle: throwError,
    };
};
