---
sidebar_position: 2
---

# CSS

Thanks to a strong foundation provided by [Vite](https://vitejs.dev), most CSS-in-JS libraries will work out of the box, as well as plain CSS imports and CSS modules.

## Global CSS

Since Viteshot renders components in isolation, it doesn't run any top-level entry points that you may have set up in your app. This means that you will need to explicitly import any global CSS from your screenshots.

For example in React:

```jsx title="/src/components/example.screenshot.jsx"
import "../index.css"; // Global CSS import

export const MyScreenshot = () => <div>Hello, World!</div>;
```

## PostCSS / Tailwind

If your CSS relies on PostCSS, it will be picked up as long as your project has a `postcss.config.js` file.

For example for Tailwind, here is the required configuration:

```js title="/postcss.config.js"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

You should also make sure that you import the global CSS as explained above.
