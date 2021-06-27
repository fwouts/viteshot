import { useState } from "react";
import App from "./App";
import { click } from "./screenshot-lib";

export const Screenshot1 = () => <div>Hello, World!</div>;

export const Screenshot2 = () => <App />;

export const Screenshot3 = () => {
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
Screenshot3.beforeScreenshot = async (element: HTMLElement) => {
  await click(element.querySelector("#button"));
};
