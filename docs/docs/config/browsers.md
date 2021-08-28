---
sidebar_position: 8
---

# Browsers and Viewports

## Playwright shooter

By default, screenshots are taken with the [Playwright](https://playwright.dev) shooter on Chromium with a viewport size of 1280x720.

### Viewports

You can customise the viewport easily, as well as take screenshots on multiple viewports automatically.

For example, here is a configuration to take each screenshot with a simulated laptop viewport (1366x768) as well as a mobile Pixel 2 viewport (411x731 with 2.625 device scale factor).

```js title="/viteshot.config.js"
const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

module.exports = {
  // ...
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
};
```

### Screenshot paths

By default, screenshots are stored in a `__screenshots__` subdirectory next to the `.screenshot.*` file, within a subdirectory corresponding to `process.platform` (e.g. `darwin` for MacOS).

You can customise this by specifying a prefix path, suffix path or both.

For example if you'd like all screenshots to be stored in a top-level `__screenshots__` directory:

```js title="/viteshot.config.js"
const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

module.exports = {
  // ...
  shooter: playwrightShooter(playwright.chromium, {
    output: {
      prefixPath: `__screenshots__/${process.platform}`,
      suffixPath: "",
    },
  }),
};
```

### Browsers

If you use the default Playwright shooter, you can also choose to take screenshots with a different browser. Simply replace `playwright.chromium` with another such as `firefox` or `webkit`. See [Playweight documentation](https://playwright.dev/docs/browsers) for more details.

:::info Taking screenshots with multiple browsers

If you want to take screenshots with multiple browsers, you can create multiple variants of `viteshot.config.js`, such as `viteshot.chromium.js` and `viteshot.webkit.js`.

Use the `-c` flag when running `viteshot` to generate screenshots with a specific browser:

```sh
$ viteshot -c viteshot.chromium.js
```

:::

## Alternative: Percy shooter

While Playwright generates screenshots on the machine that runs `viteshot`, an alternative is to use a service such as [Percy](https://percy.io), which uploads HTML/CSS snapshots to the cloud before taking screenshots with a suite of browsers.

This means that you won't have to manage screenshots yourself, but it comes at a cost (literally).

To use Percy, first install `@percy/puppeteer` and `puppeteer`.

Then, update `viteshot.config.js`:

```js title="/viteshot.config.js"
const percyShooter = require("viteshot/shooters/percy");

module.exports = {
  // ....
  shooter: percyShooter(),
};
```

You can then upload screenshots to Percy by running:

```sh
$ percy exec -- viteshot
```

:::note Do you work at Percy / BrowserStack?

Percy shooter is currently not automatically tested because Percy no longer grants free licenses to open-source projects.

If you work at Percy and would like to help improve the Percy shooter or better yet sponsor Viteshot, please get in touch!

:::
