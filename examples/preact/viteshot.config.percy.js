const percyShooter = require("viteshot/shooters/percy");

/**
 * @type {import('viteshot').UserConfig}
 */
module.exports = {
  framework: {
    type: "preact",
  },
  shooter: percyShooter(),
  wrapper: {
    path: "__reactpreview__/Wrapper",
    componentName: "Wrapper",
  },
};
