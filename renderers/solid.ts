import { JSX } from "solid-js/jsx-runtime";
import { createComponent, render } from "solid-js/web";

export async function renderScreenshots(
  components: Array<
    [
      string,
      ((props: {}) => JSX.Element) & {
        beforeScreenshot?: (element: HTMLElement) => Promise<void>;
      }
    ]
  >,
  Wrapper: ((props: { children: JSX.Element }) => JSX.Element) | null
) {
  Wrapper ||= (props) => props.children;
  const root = document.getElementById("root")!;
  for (const [name, Component] of components) {
    if (typeof Component !== "function") {
      // This is not a component.
      continue;
    }
    root.innerHTML = "";
    let detach: () => void = () => {};
    try {
      detach = render(
        () =>
          createComponent(Wrapper!, {
            children: createComponent(Component, (Component as any).args || {}),
          }),
        root
      );
      const beforeScreenshot = (Component as any).beforeScreenshot;
      if (beforeScreenshot) {
        await beforeScreenshot(root);
      }
    } catch (e) {
      root.innerHTML = `<pre class="viteshot-error">${e}\n${
        (e as any).stack
      }</pre>`;
    }
    await window.__takeScreenshot__(name);
    detach();
  }
}
