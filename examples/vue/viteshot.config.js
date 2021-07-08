const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

/**
 * @type {import('viteshot').UserConfig}
 */
module.exports = {
  framework: "vue",
  shooter: playwrightShooter(playwright.firefox),
  filePathPattern: "**/*.screenshot.vue",
};
