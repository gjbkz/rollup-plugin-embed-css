import * as rollup from 'rollup';
import * as esifycss from 'esifycss';

export const parseCSSModuleScript = (
    props: {
        code: string,
        cssKey: string,
        helper: string,
        format: rollup.ModuleFormat,
    },
): esifycss.IParseResult => {
    switch (props.format) {
    case 'es':
        return esifycss.parseCSSModuleScript(props);
    default:
        throw new Error(`UnsupportedFormat: ${props.format}`);
    }
};
