import getBrowser from "../helpers/getBrowser";
import { METRICS_URL } from "../config/config";

const tabIds = ["origin", "fork-time", "commissioned-length"];

describe("The Tabs", () => {
    let page;

    beforeAll(async done => {
        page = await getBrowser().newPage();
        await page.goto(METRICS_URL);
        done();
    });

    afterAll(async () => {
        await page.close();
    });

    it("should load without error", async () => {
        await page.waitForSelector(".tabs__link");
        const tabs = await page.$$(".tabs__link");

        expect(tabs).toHaveLength(3);

        for (let i = 0; i < tabs.length; i += 1) {
            const tab = tabs[i];
            await tab.click();
            const href = await page.evaluate(el => el.href, tab);
            const tabHandle = await page.waitForSelector(`#${tabIds[i]}`);
            const url = await page.evaluate(() => window.location.href);

            expect(tabHandle).not.toEqual(null);
            expect(url).toContain(href);
        }
    });
});
