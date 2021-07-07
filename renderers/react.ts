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
    root.innerHTML = "";
    try {
      ReactDOM.render(
        React.createElement(Wrapper, {}, React.createElement(Component)),
        root
      );
      if (Component.beforeScreenshot) {
        await Component.beforeScreenshot(root);
      }
    } catch (e) {
      root.innerHTML = `<pre class="viteshot-error">${e.stack || e}</pre>`;
    }
    await window.__takeScreenshot__(name);
    ReactDOM.unmountComponentAtNode(root);
  }
}
