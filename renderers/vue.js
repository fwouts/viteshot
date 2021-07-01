import { createApp } from "vue";

export async function renderScreenshots(components) {
  for (const [name, component] of components) {
    createApp(component).mount("#root");
    if (component.beforeScreenshot) {
      await component.beforeScreenshot(document.getElementById("root"));
    }
    await __takeScreenshot__(name);
  }
}
