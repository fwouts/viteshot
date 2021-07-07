const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

/**
 * @type {import('viteshot').UserConfig}
 */
module.exports = {
  framework: "svelte",
  browser: playwrightShooter(playwright.firefox, {
    output: {
      prefixPath: "",
      suffixPath: "__screenshots__",
    },
  }),
};
