const puppeteer = require("puppeteer");
const { USER_DATA_DIR, METRICS_URL } = require("../config/config");

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: USER_DATA_DIR
    });
    const page = await browser.newPage();
    page.goto(METRICS_URL);
})();
