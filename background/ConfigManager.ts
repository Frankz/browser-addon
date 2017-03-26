/*
  Entry-specific configuration is stored in KeePass but in future maybe
  we'll still make it available from this interface.
*/

/// <reference path="DefaultSiteConfig.ts" />
/// <reference path="../common/config.ts" />

let defaultConfig = new Config();
defaultConfig.autoFillDialogs = false;
defaultConfig.autoFillForms = true;
defaultConfig.logLevel = 4;
defaultConfig.siteConfig = defaultSiteConfig;
defaultConfig.searchAllOpenDBs = true;
defaultConfig.KeePassRPCWebSocketPort = 12546;
defaultConfig.keePassDBToOpen = "";
defaultConfig.keePassMRUDB = "";
defaultConfig.KPRPCUsername = "";
defaultConfig.connSLClient = 2;
defaultConfig.connSLServerMin = 2;
defaultConfig.KPRPCStoredKeys = [];
defaultConfig.rememberMRUDB = true;
defaultConfig.logSensitiveData = false;

class ConfigManager {
    public current: Config;
    public pending: Config;

    private readonly maxCharsPerPage: number = 10000;

    public constructor () {
        this.current = defaultConfig;
        this.pending = defaultConfig; //TODO:c: Clone?
    }

    public set (values: Partial<Config>) {
        (Object as any).assign(this.pending, values);
    }

    public setASAP (values: Partial<Config>) {
        (Object as any).assign(this.current, values);
        (Object as any).assign(this.pending, values);
        this.save();
    }

    public commit () {
        this.current = this.pending; //TODO:c: clone?
        this.save();
    }

    private splitStringToPages (str: string) {
        const numPages = Math.ceil(str.length / this.maxCharsPerPage);
        const pages = new Array(numPages);

        for (let i = 0, o = 0; i < numPages; ++i, o += this.maxCharsPerPage) {
            pages[i] = str.substr(o, this.maxCharsPerPage);
        }
        return pages;
    }

    public save () {
        const configString = JSON.stringify(this.current);
        const pages = this.splitStringToPages(configString);

        //TODO:c: Need to be able to save some config details locally and others synced
        browser.storage.local.set({ "keefoxConfigPageCount": pages.length });

        for (let i=0; i < pages.length; i++)
        {
            browser.storage.local.set({ ["keefoxConfigPage" + i]: pages[i] });
        }
    }

    public load () {
        browser.storage.local.get().then(config => {
            const pageCount = config["keefoxConfigPageCount"];

            if (!pageCount)
                return;

            let configString = "";
            for (let i=0; i < pageCount; i++)
            {
                const nextPage = config["keefoxConfigPage" + i];
                if (nextPage)
                    configString += nextPage;
            }
            if (configString)
                this.current = JSON.parse(configString);
        });
    }
}

// initialise the configuration
let configManager = new ConfigManager();
let config = configManager.current;
configManager.load();
