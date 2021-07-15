const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

/**
 * @type {import('viteshot').UserConfig}
 */
module.exports = {
  framework: "react",
  shooter: playwrightShooter(playwright.chromium, {
    contexts: {
      laptop: {
        viewport: {
          width: 1366,
          height: 768,
        },
      },
      pixel2: playwright.devices["Pixel 2"],
    },
  }),
  filePathPattern: "**/*.screenshot.@(jsx|tsx)",
  wrapper: {
    path: "__reactpreview__/Wrapper",
    componentName: "Wrapper",
  },
};
