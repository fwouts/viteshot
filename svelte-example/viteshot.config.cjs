const playwright = require("viteshot/shooters/playwright");

module.exports = {
  framework: "svelte",
  browser: playwright(),
};
