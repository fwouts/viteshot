<p align="center">
  <img src="https://raw.githubusercontent.com/zenclabs/viteshot/main/logo.png" alt="logo" width="200" />
</p>
<br/>
<p align="center">
  <a href="https://www.npmjs.com/package/viteshot">
    <img src="https://badge.fury.io/js/viteshot.svg" alt="npm" />
  </a>
  <a href="https://www.npmjs.com/package/viteshot">
    <img src="https://img.shields.io/npm/l/viteshot.svg" alt="license" />
  </a>
</p>
<br />

# Viteshot 📸

Viteshot is a fast and simple component screenshot tool based on [Vite](https://vitejs.dev).

It supports Preact, React, Solid, Svelte and Vue 3.

## Installation

```sh

# Install Viteshot.
yarn add -D viteshot # Yarn
npm install --save-dev viteshot # NPM

# Set up Viteshot configuration in your repository.
viteshot init
```

## Usage

All you need is to export UI components from files with the `.screenshot.jsx/tsx/vue/svelte` extension.

Examples:
- [Preact](https://github.com/zenclabs/viteshot/blob/main/examples/preact/src/App.screenshot.tsx)
- [React](https://github.com/zenclabs/viteshot/blob/main/examples/react-tsx/src/App.screenshot.tsx)
- [Solid](https://github.com/zenclabs/viteshot/blob/main/examples/solid/src/App.screenshot.tsx)
- [Svelte](https://github.com/zenclabs/viteshot/blob/main/examples/svelte/src/lib/Counter.screenshot.svelte)
- [Vue](https://github.com/zenclabs/viteshot/blob/main/examples/vue/src/components/HelloWorld.screenshot.vue)

Then, generate screenshots with:
```sh
# Take screenshots.
viteshot
> Capturing: src/__screenshots__/darwin/pixel2/App-App.png
> Capturing: src/__screenshots__/darwin/laptop/App-App.png
> Capturing: src/__screenshots__/darwin/pixel2/App-Clicked.png
> Capturing: src/__screenshots__/darwin/laptop/App-Clicked.png
> Capturing: src/__screenshots__/darwin/pixel2/App-Greet.png
> Capturing: src/__screenshots__/darwin/laptop/App-Greet.png
> Capturing: src/__screenshots__/darwin/laptop/App-HelloWorld.png
> Capturing: src/__screenshots__/darwin/pixel2/App-HelloWorld.png
> All done.
```

## Managing screenshots

You can manage screenshots in several possible ways:
1. Store screenshots into your Git repository (ideally using Git LFS).
2. Upload your screenshots to the cloud (e.g. using [`reg-suit`](https://github.com/reg-viz/reg-suit)).
3. Use a third-party service (e.g. [Percy](https://percy.io)).

## Storing screenshots in Git

We recommend using [Git LFS](https://git-lfs.github.com) to store screenshots. This will help prevent your Git repository from becoming bloated over time.

If you're unfamiliar with Git LFS, you can learn about it with [this short video (2 min)](https://www.youtube.com/watch?v=uLR1RNqJ1Mw) and/or going through [the official tutorial](https://github.com/git-lfs/git-lfs/wiki/Tutorial).

To set up Git LFS, [install the Git extension](https://git-lfs.github.com/) and add the following to `.gitattributes` in your repository ([source](https://github.com/americanexpress/jest-image-snapshot/issues/92#issuecomment-493582776)):

```
**/__screenshots__/*.* binary
**/__screenshots__/*.* filter=lfs diff=lfs merge=lfs -text
```

## Screenshot consistency

To ensure that screenshots are always identical, it's recommended that you generate screenshots on CI.

If you use GitHub Actions, you can run `viteshot -p` to automatically push new commits that update screenshots once they've been updated. This will fail on `main` and `master` branches.

## Configuration

You can configure the following options in `viteshot.config.js`:
```js
const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

module.exports = {
  /**
   * Configure the framework used by your project.
   */
  framework: "preact" | "react" | "solid" | "svelte" | "vue",

  /**
   * Configure your screenshot file paths.
   */
  filePathPattern:  "**/*.screenshot.*",

  /**
   * Set up a custom wrapper component (not supported yet in Vue or Svelte).
   */
  wrapper: {
    path: "__reactpreview__/Wrapper.tsx",
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

## License

MIT
