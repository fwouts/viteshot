import { SvelteComponent } from "svelte";

export async function renderScreenshots(
  components: Array<
    [
      string,
      {
        new (options: {
          target: HTMLElement | null;
          props: any;
        }): SvelteComponent & {
          beforeScreenshot?: (element: HTMLElement) => Promise<void>;
        };
      }
    ]
  >
) {
  // TODO: Support Wrapper in Svelte.
  const root = document.getElementById("root")!;
  for (const [name, Component] of components) {
    if (typeof Component !== "function") {
      // This is not a component.
      continue;
    }
    root.innerHTML = "";
    try {
      const component = new Component({
        target: root,
        props: Component.args || {},
      });
      if (component.beforeScreenshot) {
        await component.beforeScreenshot(root);
      }
    } catch (e) {
      root.innerHTML = `<pre class="viteshot-error">${e}\n${
        (e as any).stack
      }</pre>`;
    }
    await window.__takeScreenshot__(name);
  }
}
