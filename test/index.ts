import * as simple from './simple/test';
import * as cssEs from './css-es/test';
import * as cssSystem from './css-system/test';
import {$runTest, runTest} from './util';

const tests = [
    simple,
    cssEs,
    cssSystem,
];

const test = async () => {
    for (const props of tests) {
        await $runTest(props);
    }
};

runTest({
    title: 'rollup-plugin-embed-css',
    test,
    timeout: tests.reduce((sum, props) => sum + Number(props.timeout), 0),
});
