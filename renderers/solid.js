import { render } from "solid-js/web";

export async function renderScreenshots(components) {
  for (const [name, Component] of components) {
    const detach = render(() => <Component />, document.getElementById("root"));
    if (Component.beforeScreenshot) {
      await Component.beforeScreenshot(document.getElementById("root"));
    }
    await __takeScreenshot__(name);
    detach();
  }
}
