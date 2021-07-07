const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

/**
 * @type {import('viteshot').UserConfig}
 */
module.exports = {
  framework: "preact",
  browser: playwrightShooter(playwright.chromium, {
    context: playwright.devices["Pixel 2"],
    output: {
      prefixPath: "",
      suffixPath: `__screenshots__/${process.platform}`,
    },
  }),
  wrapper: {
    path: "__reactpreview__/Wrapper",
    componentName: "Wrapper",
  },
};
