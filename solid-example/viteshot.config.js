const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

module.exports = {
  framework: "solid",
  browser: playwrightShooter(playwright.firefox, {
    output: {
      prefixPath: "",
      suffixPath: "__screenshots__",
    },
  }),
  wrapper: {
    path: "__reactpreview__/Wrapper",
    componentName: "Wrapper",
  },
};
