import { Component, createApp } from "vue";

export async function renderScreenshots(
  components: Array<
    [
      string,
      Component & { beforeScreenshot?: (element: HTMLElement) => Promise<void> }
    ]
  >
) {
  // TODO: Support Wrapper in Vue.
  for (const [name, component] of components) {
    createApp(component).mount("#root");
    if (component.beforeScreenshot) {
      await component.beforeScreenshot(document.getElementById("root")!);
    }
    await window.__takeScreenshot__(name);
  }
}
