const playwright = require("viteshot/shooters/playwright");

module.exports = {
  framework: "vue",
  browser: playwright(),
};
