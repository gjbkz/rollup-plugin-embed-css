import * as path from 'path';
import * as esifycss from 'esifycss';
import * as rollup from 'rollup';
import * as pluginUtils from 'rollup-pluginutils';
import {updateBundleCSS, updateBundleScript} from './updateBundle';
import {IPluginOptions} from './types';
import {getFirstInput} from './getFirstInput';

interface IPluginCore {
    resolveId: rollup.ResolveIdHook,
    load: rollup.LoadHook,
    generateBundle: rollup.OutputPluginHooks['generateBundle'],
}

const getPluginCoreCSS = (
    session: esifycss.Session,
    filter: ReturnType<typeof pluginUtils.createFilter>,
): IPluginCore => ({
    resolveId: (importee) => importee === session.helperPath ? importee : null,
    async load(id) {
        if (id === session.helperPath) {
            return 'export const addStyle = (rules) => console.log(rules);';
        }
        if (!filter(id)) {
            return null;
        }
        return (await session.processCSS(id)).code;
    },
    generateBundle(_options, bundle) {
        const source = updateBundleCSS(bundle, this);
        this.emitFile({
            type: 'asset',
            fileName: session.configuration.output.path,
            source,
        });
    },
});

const getPluginCoreScript = (
    session: esifycss.Session,
    filter: ReturnType<typeof pluginUtils.createFilter>,
): IPluginCore => ({
    resolveId(importee, importer) {
        const id = importer && !path.isAbsolute(importee) ? path.join(path.dirname(importer), importee) : importee;
        return id === session.configuration.output.path ? session.helperPath : null;
    },
    async load(id) {
        if (!filter(id)) {
            return null;
        }
        return (await session.processCSS(id)).code;
    },
    generateBundle(_options, bundle) {
        updateBundleScript(bundle);
    },
});

const getPluginCoreDefault = (): IPluginCore => {
    const throwError = () => {
        throw new Error('NoSession');
    };
    return {
        resolveId: throwError,
        load: throwError,
        generateBundle: throwError,
    };
};

export const embedCSSPlugin = (
    options: IPluginOptions = {},
): rollup.Plugin => {
    let core = getPluginCoreDefault();
    return {
        name: 'embedCSS',
        options(inputOptions) {
            let {helper} = options;
            if (!options.css && !helper) {
                const firstInput = getFirstInput(inputOptions.input);
                if (firstInput) {
                    helper = path.join(path.dirname(firstInput), 'embedcss-helper.css.js');
                }
            }
            let helperId = '';
            if (helper) {
                helperId = path.join(__dirname, `esifycss-helper${path.extname(helper || 's.js')}`);
            }
            let css = options.css ? options.css : undefined;
            if (typeof css === 'boolean') {
                css = 'esifycssOutput.css';
            }
            const session = new esifycss.Session({
                ...options,
                helper: helperId,
                css,
                include: [],
                watch: false,
            });
            const filter = pluginUtils.createFilter(options.include || './**/*.css', options.exclude);
            if (session.configuration.output.type === 'css') {
                core = getPluginCoreCSS(session, filter);
            } else {
                core = getPluginCoreScript(session, filter);
            }
            return null;
        },
        async resolveId(importee, importer) {
            return await core.resolveId.call(this, importee, importer);
        },
        async load(id) {
            return await core.load.call(this, id);
        },
        async generateBundle(options, bundle, isWrite) {
            return await core.generateBundle.call(this, options, bundle, isWrite);
        },
    };
};
