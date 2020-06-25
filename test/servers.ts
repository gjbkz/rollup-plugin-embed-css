import * as http from 'http';
import * as sable from 'sable';
import * as selenium from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

export class ServerSet extends Set<http.Server> {

    public builder: selenium.Builder;

    private readonly drivers: Set<selenium.WebDriver>;

    public constructor() {
        super();
        this.drivers = new Set();
        const builder = this.builder = new selenium.Builder().withCapabilities({browserName: 'chrome'});
        builder.setChromeOptions(
            new chrome.Options()
            .addArguments('--headless')
            .addArguments('--auto-open-devtools-for-tabs'),
        );
        process.once('beforeExit', () => {
            this.close().catch(console.error);
        });
    }

    public async create(documentRoot: string) {
        const server = await sable.startServer({
            documentRoot,
            logLevel: 0,
        });
        server.once('close', () => this.delete(server));
        this.add(server);
        return server;
    }

    public async startBrowser(): Promise<{driver: selenium.WebDriver, close: () => Promise<void>}> {
        const driver = await this.builder.build();
        this.drivers.add(driver);
        return {
            driver,
            close: async () => {
                this.drivers.delete(driver);
                await driver.close();
            },
        };
    }

    public async close() {
        await Promise.all([
            ...[...this.drivers].map(async (driver) => await driver.close()),
            ...[...this].map(async (server) => await new Promise((resolve, reject) => {
                server.close((error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            })),
        ]);
    }

}

export const servers = new ServerSet();
