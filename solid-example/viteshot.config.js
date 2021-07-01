const playwright = require("viteshot/shooters/playwright");

module.exports = {
  framework: "solid",
  browser: playwright(),
};
