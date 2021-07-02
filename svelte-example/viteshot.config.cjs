const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

module.exports = {
  framework: "svelte",
  browser: playwrightShooter(playwright.chromium),
};
