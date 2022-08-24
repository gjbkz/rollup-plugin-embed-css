import * as http from 'http';
import * as connect from 'connect';
import * as serveStatic from 'serve-static';
import * as selenium from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

interface TestResult {
    className: Record<string, string>,
    id: Record<string, string>,
    keyframes: Record<string, string>,
    style1: string,
    style2: string,
    style3: string,
    style4: string,
}

export const startServer = async (documentRoot: string) => {
    const app = connect();
    app.use(
        (
            req: http.IncomingMessage,
            _res: http.ServerResponse,
            next: () => void,
        ) => {
            console.log(`${req.method} ${req.url}`);
            next();
        },
    );
    app.use(serveStatic(documentRoot) as connect.SimpleHandleFunction);
    const server = http.createServer(app);
    await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.once('listening', resolve);
        server.listen(3000);
    });
    return server;
};

export const startBrowser = async () => {
    const builder = new selenium.Builder().withCapabilities({
        browserName: 'chrome',
    });
    const options = new chrome.Options();
    if (process.env.CI) {
        options.addArguments('--headless');
    }
    options.addArguments('--auto-open-devtools-for-tabs');
    builder.setChromeOptions(options);
    return await builder.build();
};

export const run = async (directory: string): Promise<TestResult> => {
    const [server, driver] = await Promise.all([
        startServer(directory),
        startBrowser(),
    ]);
    const close = async () => {
        // await new Promise((resolve) => setTimeout(resolve, 60000));
        console.log('closing');
        server.close();
        await driver.close();
        console.log('closed');
    };
    try {
        const address = server.address();
        if (!address || typeof address === 'string') {
            throw new Error('InvalieAddress');
        }
        await driver.get(`http://localhost:${address.port}/`);
        console.log(`title: ${await driver.getTitle()}`);
        await driver.wait(selenium.until.titleIs('Done'), 5000);
        const result = await (
            await driver.findElement({css: 'body'})
        ).getText();
        await close();
        return JSON.parse(result) as TestResult;
    } catch (error: unknown) {
        await close();
        throw error;
    }
};
