const _getAll = page => async selector => {
    await page.waitForSelector(selector);
    return page.$$(selector);
};

export default page => {
    const getAll = _getAll(page);
    return {
        getTabs: async () => getAll(".tabs__link")
    };
};
