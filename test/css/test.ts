import * as path from 'path';
import * as rollup from 'rollup';
import * as postcss from 'postcss';
import * as vm from 'vm';
import * as esifycss from 'esifycss';
import embedCSS from '../..';
import test from 'ava';
import {createSandbox} from '../util';

test(path.basename(__dirname), async (t) => {
    const bundle = await rollup.rollup({
        input: path.join(__dirname, 'input.js'),
        plugins: [embedCSS({css: true})],
    });
    const {output} = await bundle.generate({format: 'cjs'});
    t.pass();
    const sandbox = createSandbox<{
        result: esifycss.IEsifyCSSResult,
    }>();
    const script = output[0].code;
    vm.runInNewContext(script, sandbox);
    const isCSSAsset = (
        output: rollup.OutputAsset | rollup.OutputChunk,
    ): output is rollup.OutputAsset => output.fileName.endsWith('.css') && output.type === 'asset';
    const cssAsset = output.find(isCSSAsset);
    if (!cssAsset) {
        t.fail('NoCSSAsset');
        return;
    }
    const root = postcss.parse(cssAsset.source);
    const nodes = root.nodes || [];
    const result = sandbox.exports.result || {id: {}, className: {}, keyframes: {}};
    t.is(nodes.length, 4);
    {
        const node = nodes[1] as postcss.AtRule;
        t.is(node.type, 'atrule');
        t.is(node.name, 'keyframes');
        t.is(node.params, result.keyframes.foo);
    }
    {
        const node = nodes[2] as postcss.Rule;
        t.is(node.type, 'rule');
        t.is(node.selector, `#${result.id.foo}`);
        const declarations = (node.nodes || []) as Array<postcss.Declaration>;
        t.is(declarations.length, 1);
        t.is(declarations[0].prop, 'animation');
        t.deepEqual(
            esifycss.parseAnimationShorthand(declarations[0].value),
            esifycss.parseAnimationShorthand(`2s infinite ${result.keyframes.foo}`),
        );
    }
    {
        const node = nodes[3] as postcss.Rule;
        t.is(node.type, 'rule');
        t.is(node.selector, `.${result.className.foo}`);
        const declarations = (node.nodes || []) as Array<postcss.Declaration>;
        t.is(declarations.length, 1);
        t.is(declarations[0].prop, 'animation-name');
        t.is(declarations[0].value, result.keyframes.foo);
    }
});
