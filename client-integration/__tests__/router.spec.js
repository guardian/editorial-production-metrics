import getBrowser from "../helpers/getBrowser";
import testPage from "../helpers/testPage";
import _metricsPage from "../helpers/metricsPage";
import { METRICS_URL } from "../config/config";

describe("The Tabs", () => {
    let page;
    let metricsPage;

    beforeAll(async done => {
        page = await getBrowser().newPage();
        testPage(page); // mutates page to be a bit more useful
        metricsPage = _metricsPage(page);
        await page.goto(METRICS_URL);
        done();
    });

    afterAll(async () => {
        await page.close();
    });

    it("should load without error", async () => {
        const tabs = await metricsPage.getTabs();

        expect(tabs).toHaveLength(3);

        // Without coupling a TabLink to a TabRoute with data-tab-id or similar
        // (whichseems prone to breaking)these ids need to be hardcoded here in
        // order to test the right tab is appearing
        const tabIds = ["origin", "fork-time", "commissioned-length"];

        for (let i = 0; i < tabs.length; i += 1) {
            const tab = tabs[i];
            await tab.click();
            const href = await page.getAttr(tab, "href");
            await page.getElementById(tabIds[i]);
            const url = await page.getURL();
            expect(url).toContain(href);
        }
    });
});
