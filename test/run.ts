import * as http from 'http';
import * as connect from 'connect';
import * as serveStatic from 'serve-static';
import * as selenium from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import {getBaseURL, listenPort, closeServers} from '@nlib/node-net';
import {ITestResult} from './type';

export const startServer = async (
    documentRoot: string,
) => {
    const app = connect();
    app.use((req: http.IncomingMessage, _res: http.ServerResponse, next: () => void) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
    app.use(serveStatic(documentRoot) as connect.SimpleHandleFunction);
    const server = http.createServer(app);
    await listenPort(server, 3000);
    return server;
};

export const startBrowser = async () => {
    const builder = new selenium.Builder().withCapabilities({browserName: 'chrome'});
    builder.setChromeOptions(
        new chrome.Options()
        .addArguments('--headless')
        .addArguments('--auto-open-devtools-for-tabs'),
    );
    return await builder.build();
};

export const run = async (
    directory: string,
): Promise<ITestResult> => {
    const [server, driver] = await Promise.all([startServer(directory), startBrowser()]);
    const close = async () => {
        // await new Promise((resolve) => setTimeout(resolve, 60000));
        console.log('closing');
        await Promise.all([
            closeServers(server),
            driver.close(),
        ]);
        console.log('closed');
    };
    try {
        const baseURL = getBaseURL(server.address());
        baseURL.hostname = 'localhost';
        await driver.get(`${baseURL}`);
        console.log(`title: ${await driver.getTitle()}`);
        await driver.wait(selenium.until.titleIs('Done'), 5000);
        const result = await (await driver.findElement({css: 'body'})).getText();
        await close();
        return JSON.parse(result) as ITestResult;
    } catch (error) {
        await close();
        throw error;
    }
};
