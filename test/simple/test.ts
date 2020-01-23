import * as assert from 'assert';
import * as path from 'path';
import * as rollup from 'rollup';
import * as postcss from 'postcss';
import * as vm from 'vm';
import * as esifycss from 'esifycss';
import {createSandbox, runTest} from '../util';
// import {embedCSSPlugin as embedCSS} from '../../src/embedCSSPlugin';
import embedCSS from '../..';

export const title = path.basename(__dirname);
export const timeout = 3000;

export const test = async () => {
    const bundle = await rollup.rollup({
        input: path.join(__dirname, 'input.js'),
        plugins: [
            embedCSS(),
        ],
    });
    const {output} = await bundle.generate({format: 'cjs'});
    const sandbox = createSandbox<{
        result: esifycss.IEsifyCSSResult,
    }>();
    const script = output[0].code;
    vm.runInNewContext(script, sandbox);
    const css = [...sandbox.document.stylesheets].map((sheet) => {
        return [...sheet.cssRules].map((rule) => rule.cssText).join('');
    }).join('');
    const root = postcss.parse(css);
    const nodes = root.nodes || [];
    const result = sandbox.exports.result || {id: {}, className: {}, keyframes: {}};
    assert.equal(nodes.length, 4);
    {
        const node = nodes[1] as postcss.AtRule;
        assert.equal(node.type, 'atrule');
        assert.equal(node.name, 'keyframes');
        assert.equal(node.params, result.keyframes.foo);
    }
    {
        const node = nodes[2] as postcss.Rule;
        assert.equal(node.type, 'rule');
        assert.equal(node.selector, `#${result.id.foo}`);
        const declarations = (node.nodes || []) as Array<postcss.Declaration>;
        assert.equal(declarations.length, 1);
        assert.equal(declarations[0].prop, 'animation');
        assert.deepEqual(
            esifycss.parseAnimationShorthand(declarations[0].value),
            esifycss.parseAnimationShorthand(`2s infinite ${result.keyframes.foo}`),
        );
    }
    {
        const node = nodes[3] as postcss.Rule;
        assert.equal(node.type, 'rule');
        assert.equal(node.selector, `.${result.className.foo}`);
        const declarations = (node.nodes || []) as Array<postcss.Declaration>;
        assert.equal(declarations.length, 1);
        assert.equal(declarations[0].prop, 'animation-name');
        assert.equal(declarations[0].value, result.keyframes.foo);
    }
};

if (!module.parent) {
    runTest({title, test, timeout});
}
