const NodeEnvironment = require("jest-environment-node");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { SETUP_DIR } = require("./config");

class PuppeteerEnvironment extends NodeEnvironment {
    async setup() {
        await super.setup();
        const wsEndpoint = fs.readFileSync(
            path.join(SETUP_DIR, "wsEndpoint"),
            "utf8"
        );
        if (!wsEndpoint) {
            throw new Error("wsEndpoint not found");
        }
        this.global.__BROWSER__ = await puppeteer.connect({
            browserWSEndpoint: wsEndpoint
        });
    }

    async teardown() {
        await super.teardown();
        await this.global.__BROWSER__.close();
    }
}

module.exports = PuppeteerEnvironment;
