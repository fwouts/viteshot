import * as Preact from "preact";

export async function renderScreenshots(
  components: Array<
    [
      string,
      Preact.ComponentType<{}> & {
        beforeScreenshot?: (element: HTMLElement) => Promise<void>;
        skipScreenshot?: boolean;
      }
    ]
  >,
  Wrapper: Preact.ComponentType<{}> | null
) {
  Wrapper ||= Preact.Fragment;
  const root = document.getElementById("root")!;
  for (const [name, Component] of components) {
    if (typeof Component !== "function") {
      // This is not a component.
      continue;
    }
    if ((Component as any).skipScreenshot) {
      // skipping this component
      continue;
    }
    root.innerHTML = "";
    try {
      Preact.render(
        Preact.createElement(
          Wrapper,
          {},
          Preact.createElement(Component, (Component as any).args || {})
        ),
        root
      );
      const beforeScreenshot = (Component as any).beforeScreenshot;
      if (beforeScreenshot) {
        await beforeScreenshot(root);
      }
    } catch (e) {
      root.innerHTML = `<pre class="viteshot-error">${
        (e as any).stack || e
      }</pre>`;
    }
    await window.__takeScreenshot__(name);
    Preact.render(null, root);
  }
}
