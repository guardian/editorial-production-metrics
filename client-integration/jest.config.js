module.exports = {
    roots: ["./"],
    globalSetup: "./config/setup.js",
    globalTeardown: "./config/teardown.js",
    testEnvironment: "./config/puppeteerEnvironment.js"
};
