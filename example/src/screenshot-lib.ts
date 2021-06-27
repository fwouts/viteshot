import uuid from "uuid";

declare global {
  interface Window {
    __click__(selector: string): Promise<void>;
  }
}

export async function click(element: Element | null) {
  if (!element) {
    throw new Error(`No element to click on.`);
  }
  const id = element.id || uuid.v4();
  element.id = id;
  await window.__click__(`#${id}`);
}
