import {servers} from './servers';
import {test as testES} from './test-es';
import {test as testIIFE} from './test-iife';
import {test as testUMD} from './test-umd';
import {test as testSystem} from './test-system';

const test = async () => {
    await testES(servers);
    console.log('#### passed: es');
    await testIIFE(servers);
    console.log('#### passed: iife');
    await testUMD(servers);
    console.log('#### passed: umd');
    await testSystem(servers);
    console.log('#### passed: system');
};

test()
.then(async () => {
    await servers.close();
    process.exit(0);
})
.catch((error) => {
    console.error(error);
    process.exit(1);
});
