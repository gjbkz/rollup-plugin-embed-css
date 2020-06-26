import * as selenium from 'selenium-webdriver';
import {getBaseURL} from '@nlib/node-net';
import {ITestResult} from './type';
import {ServerSet} from './servers';

export const run = async (
    {directory, servers}: {
        directory: string,
        servers: ServerSet,
    },
): Promise<ITestResult> => {
    const server = await servers.create(directory);
    const baseURL = getBaseURL(server.address());
    const {driver, close} = await servers.startBrowser();
    try {
        await driver.get(`${baseURL}`);
        console.log(`title: ${await driver.getTitle()}`);
        await driver.wait(selenium.until.titleIs('Done'), 10000);
        const result = await (await driver.findElement({css: 'body'})).getText();
        console.log(result);
        await Promise.all([server.close(), close()]);
        return JSON.parse(result) as ITestResult;
    } catch (error) {
        // await new Promise((resolve) => setTimeout(resolve, 60000));
        await Promise.all([server.close(), close()]);
        throw error;
    }
};
