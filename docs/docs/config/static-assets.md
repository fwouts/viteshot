---
sidebar_position: 6
---

# Static Assets

Your components may depend on static assets such as images. ViteShot automatically lets you import any asset with an `import` statement.

If you prefer to use explicit paths instead, you may need to configure a public directory for ViteShot.

This is done via the `vite.public` property in `viteshot.config.js`:

```js title="/viteshot.config.js"
const vite = require("vite");

module.exports = {
  // ...
  vite: vite.defineConfig({
    public: "static",
  }),
};
```

For more information, see [Vite's documentation](https://vitejs.dev/guide/assets.html#the-public-directory).
