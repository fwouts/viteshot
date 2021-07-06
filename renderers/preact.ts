import * as Preact from "preact";

export async function renderScreenshots(
  components: Array<
    [
      string,
      Preact.ComponentType<{}> & {
        beforeScreenshot?: (element: HTMLElement) => Promise<void>;
      }
    ]
  >,
  Wrapper: Preact.ComponentType<{}> | null
) {
  Wrapper ||= Preact.Fragment;
  for (const [name, Component] of components) {
    Preact.render(
      Preact.createElement(Wrapper, {}, Preact.createElement(Component, {})),
      document.getElementById("root")!
    );
    if (Component.beforeScreenshot) {
      await Component.beforeScreenshot(document.getElementById("root")!);
    }
    await window.__takeScreenshot__(name);
  }
}
