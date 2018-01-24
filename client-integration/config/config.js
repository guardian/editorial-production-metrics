const os = require("os");
const path = require("path");

module.exports = {
    SETUP_DIR: path.join(os.tmpdir(), "jest_puppeteer_global_setup"),
    USER_DATA_DIR: path.join(os.tmpdir(), "user_data_dir"),
    METRICS_URL: "https://productionmetrics.local.dev-gutools.co.uk"
};
