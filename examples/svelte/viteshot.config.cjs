const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

/**
 * @type {import('viteshot').UserConfig}
 */
module.exports = {
  framework: "svelte",
  shooter: playwrightShooter(playwright.firefox),
  filePathPattern: "**/*.screenshot.svelte",
  // TODO: Figure out why the default Vite config results in problems.
  vite: {},
};
