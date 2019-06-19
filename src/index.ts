import * as path from 'path';
import * as esifycss from 'esifycss';
import * as rollup from 'rollup';
import * as pluginUtils from 'rollup-pluginutils';

module.exports = (
    options: esifycss.ISessionParameters & {
        exclude: Array<string | RegExp> | string | RegExp | null,
    },
): rollup.Plugin => {
    const filter = pluginUtils.createFilter(options.include || './**/*.css', options.exclude);
    options.include = [];
    options.watch = false;
    let session: esifycss.Session | undefined;
    return {
        name: 'embedCSS',
        options({watch}) {
            options.watch = Boolean(watch);
            return null;
        },
        async resolveId(id, importer) {
            const filePath = importer ? path.join(path.dirname(importer), id) : id;
            if (!filter(filePath)) {
                return null;
            }
            if (!session) {
                session = new esifycss.Session(options);
                await session.outputHelperScript();
            }
            await session.processCSS(filePath);
            return `${filePath}${session.configuration.ext}`;
        },
    };
};
