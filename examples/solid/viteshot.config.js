const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

/**
 * @type {import('viteshot').UserConfig}
 */
module.exports = {
  framework: "solid",
  browser: playwrightShooter(playwright.firefox, {
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
