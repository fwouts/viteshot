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
  >
) {
  for (const [name, Component] of components) {
    ReactDOM.render(
      React.createElement(Component),
      document.getElementById("root")
    );
    if (Component.beforeScreenshot) {
      await Component.beforeScreenshot(document.getElementById("root")!);
    }
    await window.__takeScreenshot__(name);
  }
}
