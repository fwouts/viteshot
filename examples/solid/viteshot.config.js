const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

/**
 * @type {import('viteshot').UserConfig}
 */
module.exports = {
  framework: "solid",
  shooter: playwrightShooter(playwright.firefox),
  filePathPattern: "**/*.screenshot.@(jsx|tsx)",
  wrapper: {
    path: "__reactpreview__/Wrapper",
    componentName: "Wrapper",
  },
};
