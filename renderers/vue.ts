import { App, Component, createApp } from "vue";

export async function renderScreenshots(
  components: Array<
    [
      string,
      Component & { beforeScreenshot?: (element: HTMLElement) => Promise<void> }
    ]
  >
) {
  // TODO: Support Wrapper in Vue.
  const root = document.getElementById("root")!;
  for (const [name, component] of components) {
    root.innerHTML = "";
    let app: App | null = null;
    try {
      app = createApp(component);
      app.mount("#root");
      if (component.beforeScreenshot) {
        await component.beforeScreenshot(root);
      }
    } catch (e) {
      root.innerHTML = `<pre class="viteshot-error">${e}\n${e.stack}</pre>`;
    }
    await window.__takeScreenshot__(name);
    if (app) {
      app.unmount();
    }
  }
}
