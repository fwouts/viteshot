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
  for (const [name, Component] of components) {
    const component = new Component({
      target: document.getElementById("root"),
    });
    if (component.beforeScreenshot) {
      await component.beforeScreenshot(document.getElementById("root")!);
    }
    await window.__takeScreenshot__(name);
  }
}
