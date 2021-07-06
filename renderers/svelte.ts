import { SvelteComponent } from "svelte";

export async function renderScreenshots(
  components: Array<
    [
      string,
      {
        new (options: { target: HTMLElement | null }): SvelteComponent & {
          beforeScreenshot?: (element: HTMLElement) => Promise<void>;
        };
      }
    ]
  >
) {
  // TODO: Support Wrapper in Svelte.
  const root = document.getElementById("root")!;
  for (const [name, Component] of components) {
    root.innerHTML = "";
    try {
      const component = new Component({
        target: root,
      });
      if (component.beforeScreenshot) {
        await component.beforeScreenshot(root);
      }
    } catch (e) {
      root.innerHTML = `<pre>${e}</pre>`;
    }
    await window.__takeScreenshot__(name);
  }
}
