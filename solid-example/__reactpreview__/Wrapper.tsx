import type { Component } from "solid-js";

export const Wrapper: Component = (props) => (
  <div
    style={{
      padding: 16,
    }}
  >
    {props.children}
  </div>
);
