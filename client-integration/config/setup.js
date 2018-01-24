const puppeteer  = require("puppeteer");
const fs  = require("fs");
const mkdirp  = require("mkdirp");
const path  = require("path");
const { SETUP_DIR, USER_DATA_DIR }  = require("./config");

module.exports = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: USER_DATA_DIR
    });
    mkdirp.sync(SETUP_DIR);
    fs.writeFileSync(path.join(SETUP_DIR, "wsEndpoint"), browser.wsEndpoint());
};
