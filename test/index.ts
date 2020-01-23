import * as simple from './simple/test';
import * as css from './css/test';
import {$runTest, runTest} from './util';

const tests = [simple, css];

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
