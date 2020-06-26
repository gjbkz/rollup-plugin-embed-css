import {servers} from './servers';
import {test as testES} from './test-es';
import {test as testIIFE} from './test-iife';
import {test as testUMD} from './test-umd';
import {test as testSystem} from './test-system';

const test = async () => {
    await testES(servers);
    await testIIFE(servers);
    await testUMD(servers);
    await testSystem(servers);
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
