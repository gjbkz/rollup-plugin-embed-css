import {test as testES} from './test-es';
import {test as testIIFE} from './test-iife';
import {test as testUMD} from './test-umd';
import {test as testSystem} from './test-system';
import {test as testCSS} from './test-css';

const test = async () => {
    const tests = [
        testES,
        testIIFE,
        testUMD,
        testSystem,
        testCSS,
    ];
    for (const test of tests) {
        await test();
    }
};

test()
.catch((error) => {
    console.error(error);
    process.exit(1);
});
