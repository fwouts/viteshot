---
sidebar_position: 1
---

# Config Overview

Viteshot may not work out of the box for complex use cases, but fear not! You may only be one line of config away from your goal.

Here is an overview of supported options:

##

```js title="/viteshot.config.js"
const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

module.exports = {
  /**
   * Configure the framework used by your project.
   */
  framework: {
    type: "preact" | "react" | "solid" | "svelte" | "vue"
  },

  /**
   * Configure your screenshot file paths.
   */
  filePathPattern:  "**/*.screenshot.*",

  /**
   * Set up a custom wrapper component (not supported in Vue or Svelte).
   */
  wrapper: {
    path: "__viteshot__/ScreenshotWrapper.tsx",
    componentName: "Wrapper"
  },

  /**
   * Choose a shooter.
   *
   * See https://github.com/zenclabs/viteshot/tree/main/shooters for other choices.
   */
  shooter: playwrightShooter(playwright.chromium, {
    // Take each screenshot in two different viewports.
    contexts: {
      laptop: {
        viewport: {
          width: 1366,
          height: 768,
        },
      },
      pixel2: playwright.devices["Pixel 2"],
    },
    output: {
      // Put all screenshots in a top-level __screenshots__ directory.
      prefixPath: `__screenshots__/${process.platform}`,
      // Alternatively, put all screenshots next to the component definition.
      suffixPath: `__screenshots__/${process.platform}`
    }
  }),

  /**
   * Specify a custom Vite configuration.
   */
  vite: vite.UserConfig;
}
```

Read on to learn about:

- setting up CSS rules
- wrapping components (including providing context)
- configuring module aliases
- SVGR support (React only)
- specifying screenshot viewports
- using multiple browsers
- customising generated screenshot file paths
