import * as Preact from "preact";

export const Wrapper: Preact.FunctionalComponent = (props) => (
  <div
    style={{
      padding: 16,
    }}
  >
    {props.children}
  </div>
);
