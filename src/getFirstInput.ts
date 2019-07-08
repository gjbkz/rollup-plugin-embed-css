import * as rollup from 'rollup';

export const getFirstInput = (
    input: rollup.InputOptions['input'],
): string | null => {
    if (typeof input === 'string') {
        return input;
    } else if (Array.isArray(input)) {
        return input[0] || null;
    } else if (typeof input === 'object') {
        return input[Object.keys(input)[0]] || null;
    }
    return null;
};
