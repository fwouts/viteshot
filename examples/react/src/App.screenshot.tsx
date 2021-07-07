import { useState } from "react";
import AppComponent from "./App";

export const HelloWorld = () => <Greet name="World" />;

export const Greet = (props: { name: string }) => <div>Hi, {props.name}!</div>;

export const App = () => <AppComponent />;

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
