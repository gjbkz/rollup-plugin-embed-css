import * as assert from 'assert';
import * as path from 'path';
import * as vm from 'vm';
import * as rollup from 'rollup';
import * as acorn from 'acorn';
import * as esifycss from 'esifycss';
import {isOutputChunk} from '../../src/isOutputChunk';
import {createSandbox, runTest} from '../util';
import * as postcss from 'postcss';
// import {embedCSSPlugin as embedCSS} from '../../src/embedCSSPlugin';
import embedCSS from '../..';

export const title = path.basename(__dirname);
export const timeout = 3000;

interface INode {
    type: string,
    start: number,
    end: number,
}

interface IIdentifier extends INode {
    name: string,
}

interface IExportSpecifier extends INode {
    local: IIdentifier,
    exported: IIdentifier,
}

interface IExportDecralation extends INode {
    specifiers: Array<IExportSpecifier>,
}

interface IProgram {
    body: Array<IExportDecralation>,
}

const replaceExports = (
    code: string,
) => {
    const ast = acorn.parse(code, {sourceType: 'module'}) as any as IProgram;
    return ast.body
    .filter((node) => node.type === 'ExportNamedDeclaration')
    .sort((n1, n2) => n1.start < n2.start ? 1 : -1)
    .reduce(
        (code, node) => [
            code.slice(0, node.start),
            ...node.specifiers.map(({local, exported}) => `exports.${exported.name} = ${local.name};`),
            code.slice(node.end),
        ].join('\n'),
        code,
    );
};

const assureIdentifierMap = (
    input: any,
): esifycss.IIdentifierMap => {
    if (typeof input === 'object' && input) {
        const result: esifycss.IIdentifierMap = {};
        for (const [key, value] of Object.entries(input)) {
            if (typeof value === 'string') {
                result[key] = value;
            } else {
                throw new Error(`NonString: ${key}: ${value}`);
            }
        }
        return result;
    }
    throw new Error(`NonObject: ${input}`);
};

const assureEsifyCSSResult = (
    input: any,
): esifycss.IEsifyCSSResult => {
    if (typeof input === 'object' && input) {
        return {
            className: assureIdentifierMap(input.className),
            id: assureIdentifierMap(input.id),
            keyframes: assureIdentifierMap(input.keyframes),
        };
    }
    throw new Error(`NonObject: ${input}`);
};

const getExport = (
    props: {
        code: string,
        exports: Array<string>,
    },
) => {
    const sandbox = createSandbox();
    const code = replaceExports(props.code);
    vm.runInNewContext(code, sandbox);
    switch (props.exports.length) {
    case 1:
        return assureEsifyCSSResult(sandbox.exports[props.exports[0]]);
    case 3:
        return assureEsifyCSSResult(sandbox.exports);
    default:
        throw new Error('InvalidExports');
    }
};

const dependsOn = (
    {imports, dynamicImports}: rollup.OutputChunk,
    {fileName}: rollup.OutputChunk | rollup.OutputAsset,
) => imports.includes(fileName) || dynamicImports.includes(fileName);

const getCSSData = (
    output: rollup.RollupOutput['output'],
    fileName: string,
): esifycss.IEsifyCSSResult => {
    const chunk = output.find((chunk) => chunk.fileName === fileName);
    if (!chunk) {
        throw new Error(`NoChunk: ${fileName}`);
    }
    if (chunk.type === 'asset') {
        throw new Error(`IsAsset: ${fileName}`);
    }
    return output
    .filter((c) => dependsOn(chunk, c) && output.find(({fileName: n}) => n === `${c.fileName}.css`))
    .filter(isOutputChunk)
    .reduce(
        (result, chunk) => {
            const data = getExport(chunk);
            return {
                className: {...result.className, ...data.className},
                id: {...result.id, ...data.id},
                keyframes: {...result.keyframes, ...data.keyframes},
            };
        },
        {className: {}, id: {}, keyframes: {}},
    );
};

const loadCSS = (
    output: rollup.RollupOutput['output'],
    fileName: string,
): postcss.Root => {
    const chunk = output.find((chunk) => chunk.fileName === fileName);
    if (!chunk) {
        throw new Error(`NoSource: ${fileName}`);
    }
    if (chunk.type === 'chunk') {
        throw new Error(`IsChunk: ${fileName}`);
    }
    return postcss.parse(chunk.source);
};

export const test = async () => {
    const bundle = await rollup.rollup({
        input: [
            path.join(__dirname, 'input1.js'),
            path.join(__dirname, 'input2.js'),
        ],
        plugins: [embedCSS({css: true})],
    });
    const {output} = await bundle.generate({format: 'es'});
    {
        const {className, id, keyframes} = getCSSData(output, 'input1.js');
        const root = loadCSS(output, 'input1.js.css');
        assert.equal(typeof className.c, 'string');
        assert.equal(typeof className.foo, 'string');
        assert.equal(typeof id.foo, 'string');
        assert.equal(typeof keyframes.foo, 'string');
        assert.deepEqual(className, {c: className.c, foo: className.foo});
        assert.deepEqual(id, {foo: id.foo});
        assert.deepEqual(keyframes, {foo: keyframes.foo});
        const [, n2, n3, n4, n5, n6, n7] = root.nodes || [];
        assert.equal(n2.type, 'rule');
        if (n2.type === 'rule') {
            assert.equal(n2.selector, ':root');
            const [d1, d2] = n2.nodes || [];
            assert.equal(d2, undefined);
            assert.equal(d1.type, 'decl');
            if (d1.type === 'decl') {
                assert.equal(d1.prop, '--file');
                assert.equal(d1.value, 'b1');
            }
        }
        assert.equal(n3.type, 'atrule');
        if (n3.type === 'atrule') {
            assert.equal(n3.name, 'keyframes');
            assert.equal(n3.params, keyframes.foo);
        }
        assert.equal(n4.type, 'rule');
        if (n4.type === 'rule') {
            assert.equal(n4.selector, `#${id.foo}`);
            const [d1, d2] = n4.nodes || [];
            assert.equal(d2, undefined);
            assert.equal(d1.type, 'decl');
            if (d1.type === 'decl') {
                assert.equal(d1.prop, 'animation');
                assert.equal(d1.value, `2s infinite ${keyframes.foo}`);
            }
        }
        assert.equal(n5.type, 'rule');
        if (n5.type === 'rule') {
            assert.equal(n5.selector, `.${className.foo}`);
        }
        assert.equal(n6.type, 'rule');
        if (n6.type === 'rule') {
            assert.equal(n6.selector, ':root');
        }
        assert.equal(n7.type, 'rule');
        if (n7.type === 'rule') {
            assert.equal(n7.selector, `.${className.c}`);
        }
    }
    {
        const {className, id, keyframes} = getCSSData(output, 'input2.js');
        const root = loadCSS(output, 'input2.js.css');
        assert.equal(typeof className.c, 'string');
        assert.equal(typeof className.foo, 'string');
        assert.equal(typeof id.foo, 'string');
        assert.equal(typeof keyframes.foo, 'string');
        assert.deepEqual(className, {c: className.c, foo: className.foo});
        assert.deepEqual(id, {foo: id.foo});
        assert.deepEqual(keyframes, {foo: keyframes.foo});
        const [, n2, n3, n4, n5, n6, n7] = root.nodes || [];
        assert.equal(n2.type, 'rule');
        if (n2.type === 'rule') {
            assert.equal(n2.selector, ':root');
            const [d1, d2] = n2.nodes || [];
            assert.equal(d2, undefined);
            assert.equal(d1.type, 'decl');
            if (d1.type === 'decl') {
                assert.equal(d1.prop, '--file');
                assert.equal(d1.value, 'b2');
            }
        }
        assert.equal(n3.type, 'atrule');
        if (n3.type === 'atrule') {
            assert.equal(n3.name, 'keyframes');
            assert.equal(n3.params, keyframes.foo);
        }
        assert.equal(n4.type, 'rule');
        if (n4.type === 'rule') {
            assert.equal(n4.selector, `#${id.foo}`);
            const [d1, d2] = n4.nodes || [];
            assert.equal(d2, undefined);
            assert.equal(d1.type, 'decl');
            if (d1.type === 'decl') {
                assert.equal(d1.prop, 'animation');
                assert.equal(d1.value, `2s infinite ${keyframes.foo}`);
            }
        }
        assert.equal(n5.type, 'rule');
        if (n5.type === 'rule') {
            assert.equal(n5.selector, `.${className.foo}`);
        }
        assert.equal(n6.type, 'rule');
        if (n6.type === 'rule') {
            assert.equal(n6.selector, ':root');
        }
        assert.equal(n7.type, 'rule');
        if (n7.type === 'rule') {
            assert.equal(n7.selector, `.${className.c}`);
        }
    }
};

if (!module.parent) {
    runTest({title, test, timeout});
}
