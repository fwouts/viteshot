---
sidebar_position: 6
---

# Vite Config

As we've seen in [Custom Aliases](/docs/config/alias), you can pass any custom Vite config to Viteshot in the `vite` property of `viteshot.config.js`.

```js title="/viteshot.config.js"
const vite = require("vite");

module.exports = {
  // ...
  vite: vite.defineConfig({
    // ...
  }),
};
```

For more information on what options you can pass, see [Vite's documentation](https://vitejs.dev/config).
