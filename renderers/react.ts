import React from "react";
import ReactDOM from "react-dom";

export async function renderScreenshots(
  components: Array<
    [
      string,
      React.ComponentType<{}> & {
        beforeScreenshot?: (element: HTMLElement) => Promise<void>;
      }
    ]
  >,
  Wrapper: React.ComponentType<{}> | null
) {
  Wrapper ||= React.Fragment;
  const root = document.getElementById("root")!;
  for (const [name, Component] of components) {
    if (typeof Component !== "function") {
      // This is not a component.
      continue;
    }
    root.innerHTML = "";
    try {
      ReactDOM.render(
        React.createElement(
          Wrapper,
          {},
          React.createElement(Component, (Component as any).args || {})
        ),
        root
      );
      const beforeScreenshot = (Component as any).beforeScreenshot;
      if (beforeScreenshot) {
        await beforeScreenshot(root);
      }
    } catch (e) {
      root.innerHTML = `<pre class="viteshot-error">${
        (e as any).stack || e
      }</pre>`;
    }
    await window.__takeScreenshot__(name);
    ReactDOM.unmountComponentAtNode(root);
  }
}
