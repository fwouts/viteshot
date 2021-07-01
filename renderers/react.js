import React from "react";
import ReactDOM from "react-dom";

export async function renderScreenshots(components) {
  for (const [name, Component] of components) {
    ReactDOM.render(
      React.createElement(Component),
      document.getElementById("root")
    );
    if (Component.beforeScreenshot) {
      await Component.beforeScreenshot(document.getElementById("root"));
    }
    await __takeScreenshot__(name);
  }
}
