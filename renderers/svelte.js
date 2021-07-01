export async function renderScreenshots(components) {
  for (const [name, Component] of components) {
    const component = new Component({
      target: document.getElementById("root"),
    });
    if (component.beforeScreenshot) {
      await component.beforeScreenshot(document.getElementById("root"));
    }
    await __takeScreenshot__(name);
  }
}
