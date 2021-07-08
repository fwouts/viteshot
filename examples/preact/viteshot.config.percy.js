const percyShooter = require("viteshot/shooters/percy");

/**
 * @type {import('viteshot').UserConfig}
 */
module.exports = {
  framework: "preact",
  shooter: percyShooter(),
  wrapper: {
    path: "__reactpreview__/Wrapper",
    componentName: "Wrapper",
  },
};
