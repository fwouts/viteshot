const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

module.exports = {
  framework: "vue",
  browser: playwrightShooter(playwright.firefox),
};
