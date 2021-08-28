---
sidebar_position: 4
---

# SVGR

:::caution Supported frameworks

As of `v0.1.8`, this feature is only supported in **React**.

Contributions are welcome!

:::

SVGR is a useful feature that allows you to import a `.svg` file as a component directly into your React code.

By default, you can import `ReactComponent` for any SVG file:

```jsx
import { ReactComponent as Logo } from "./logo.svg";

function App() {
  return (
    <div className="App">
      <Logo className="App-logo" alt="logo" />
      ...
    </div>
  );
}
```

You can customise the exported component name. For example, if you'd like to use a default import, use the following configuration:

```js title="/viteshot.config.js"
module.exports = {
  framework: {
    type: "react",
    svgr: {
      componentName: "default",
    },
  },
  // ...
};
```

The above example then becomes:

```jsx
import Logo from "./logo.svg";

function App() {
  return (
    <div className="App">
      <Logo className="App-logo" alt="logo" />
      ...
    </div>
  );
}
```
