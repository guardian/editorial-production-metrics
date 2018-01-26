// Monkey patch puppetter to be a bit more useable
export default page =>
    Object.assign(page, {
        // puppeteer's getURL doesn't work with pushstate currently, so this
        // will path that for the time being
        getURL: async () => page.evaluate(() => window.location.href),
        getAttr: async (el, attr) =>
            page.evaluate((node, prop) => node[prop], el, attr),
        getElementById: async id => page.waitForSelector(`#${id}`)
    });
