import { App, Component, createApp } from "vue";

export async function renderScreenshots(
  components: Array<
    [
      string,
      Component & { beforeScreenshot?: (element: HTMLElement) => Promise<void>, skipScreenshot?: boolean }
    ]
  >
) {
  // TODO: Support Wrapper in Vue.
  const root = document.getElementById("root")!;
  for (const [name, component] of components) {
    if (component.skipScreenshot) {
      // skipping this component
      continue;
    }
    root.innerHTML = "";
    let app: App | null = null;
    try {
      // TODO: Support auto-generated fake props.
      app = createApp(component);
      app.mount("#root");
      if (component.beforeScreenshot) {
        await component.beforeScreenshot(root);
      }
    } catch (e) {
      root.innerHTML = `<pre class="viteshot-error">${e}\n${
        (e as any).stack
      }</pre>`;
    }
    await window.__takeScreenshot__(name);
    if (app) {
      app.unmount();
    }
  }
}
