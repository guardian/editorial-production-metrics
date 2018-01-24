const rimraf = require("rimraf");
const { SETUP_DIR } = require("./config");

module.exports = async () => {
    rimraf.sync(SETUP_DIR);
};
