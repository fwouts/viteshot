import { h } from "preact";
import { useState } from "preact/hooks";
import Home from "./routes/home";

export const HelloWorld = () => <div>Hi, World!</div>;

export const App = () => <Home />;

export const Clicked = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <div>
      <button id="button" onClick={() => setClicked(true)}>
        Click me
      </button>
      <br />
      {clicked ? "clicked" : "not clicked"}
    </div>
  );
};
Clicked.beforeScreenshot = async (element: HTMLElement) => {
  element.querySelector<HTMLButtonElement>("#button")!.click();
};
