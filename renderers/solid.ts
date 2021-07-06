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
    root.innerHTML = "";
    let detach: () => void = () => {};
    try {
      detach = render(
        () =>
          createComponent(Wrapper!, {
            children: createComponent(Component, {}),
          }),
        root
      );
      if (Component.beforeScreenshot) {
        await Component.beforeScreenshot(root);
      }
    } catch (e) {
      root.innerHTML = `<pre>${e}\n${e.stack}</pre>`;
    }
    await window.__takeScreenshot__(name);
    detach();
  }
}
