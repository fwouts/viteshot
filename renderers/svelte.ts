import { SvelteComponent } from "svelte";
// @ts-ignore
import { generateFakeProps } from "viteshot/renderers/helpers/fake-props";

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
    root.innerHTML = "";
    try {
      const component = new Component({
        target: root,
        props: generateFakeProps(),
      });
      if (component.beforeScreenshot) {
        await component.beforeScreenshot(root);
      }
    } catch (e) {
      root.innerHTML = `<pre class="viteshot-error">${e}\n${e.stack}</pre>`;
    }
    await window.__takeScreenshot__(name);
  }
}
