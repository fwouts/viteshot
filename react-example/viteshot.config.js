const playwright = require("viteshot/shooters/playwright");

module.exports = {
  framework: "react",
  browser: playwright(),
};
