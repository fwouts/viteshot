---
sidebar_position: 5
---

# Custom Aliases

If you use custom aliases, you may need to help ViteShot resolve imports.

For example if you use Webpack, you would need the following configuration:

```js title="/viteshot.config.js"
const webpackConfig = require("./webpack.aliases");
const vite = require("vite");

module.exports = {
  // ...
  vite: vite.defineConfig({
    resolve: {
      alias: webpackConfig.resolve.alias,
    },
  }),
};
```

For more information, see [Vite's documentation](https://vitejs.dev/config/#resolve-alias).

## TypeScript support

If you use TypeScript, you're in luck.

ViteShot uses [vite-tsconfig-paths](https://github.com/aleclarson/vite-tsconfig-paths), which automatically detects aliases from `tsconfig.json`. As a result, you may not need to explicitly provide aliases.
