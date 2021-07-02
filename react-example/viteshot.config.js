const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

module.exports = {
  framework: "react",
  browser: playwrightShooter(
    playwright.chromium,
    playwright.devices["Pixel 2"]
  ),
};
