import { createSignal } from "solid-js";
import AppComponent from "./App";

export const HelloWorld = ({ label }: { label: string }) => <div>{label}</div>;
HelloWorld.args = {
  label: "Hello, World!",
};

export const App = () => <AppComponent />;

export const Clicked = () => {
  const [clicked, setClicked] = createSignal(false);

  return (
    <div>
      <button id="button" onClick={() => setClicked(true)}>
        Click me
      </button>
      <br />
      {clicked() ? "clicked" : "not clicked"}
    </div>
  );
};
Clicked.beforeScreenshot = async (element: HTMLElement) => {
  element.querySelector<HTMLButtonElement>("#button")!.click();
};
