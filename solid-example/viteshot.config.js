const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

module.exports = {
  framework: "solid",
  browser: playwrightShooter(playwright.firefox),
};
