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
  for (const [name, Component] of components) {
    const detach = render(
      () =>
        createComponent(Wrapper!, { children: createComponent(Component, {}) }),
      document.getElementById("root")!
    );
    if (Component.beforeScreenshot) {
      await Component.beforeScreenshot(document.getElementById("root")!);
    }
    await window.__takeScreenshot__(name);
    detach();
  }
}
