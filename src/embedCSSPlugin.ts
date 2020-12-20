import * as path from 'path';
import * as esifycss from 'esifycss';
import * as rollup from 'rollup';
import * as pluginUtils from 'rollup-pluginutils';
import {getFirstInput} from './getFirstInput';
import {cssPlugin} from './cssPlugin';
import {scriptPlugin} from './scriptPlugin';
import {IPluginOptions} from './types';
import {defaultPlugin} from './defaultPlugin';

export const embedCSSPlugin = (
    pluginOptions: IPluginOptions = {},
): rollup.Plugin => {
    let core = defaultPlugin();
    return {
        name: 'embedCSS',
        buildStart(inputOptions) {
            let {helper} = pluginOptions;
            if (!pluginOptions.css && !helper) {
                const firstInput = getFirstInput(inputOptions.input);
                if (firstInput) {
                    helper = path.join(path.dirname(firstInput), 'embedcss-helper.css.js');
                }
            }
            let helperId: string | undefined;
            if (helper) {
                helperId = path.join(__dirname, `esifycss-helper${path.extname(helper || 's.js')}`);
            }
            let css = pluginOptions.css ? pluginOptions.css : undefined;
            if (typeof css === 'boolean') {
                css = 'esifycssOutput.css';
            }
            const session = new esifycss.Session({
                ...pluginOptions,
                helper: helperId,
                css,
                include: [],
                watch: false,
            });
            const filter = pluginUtils.createFilter(pluginOptions.include || './**/*.css', pluginOptions.exclude);
            if (session.configuration.output.type === 'css') {
                core = cssPlugin(session, filter);
            } else {
                core = scriptPlugin(session, filter);
            }
        },
        async resolveId(importee, importer, options) {
            return await core.resolveId.call(this, importee, importer, options);
        },
        async load(id) {
            return await core.load.call(this, id);
        },
        async generateBundle(options, bundle, isWrite) {
            await core.generateBundle.call(this, options, bundle, isWrite);
        },
    };
};
