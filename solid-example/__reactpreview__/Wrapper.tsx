import type { Component } from "solid-js";
import styles from "./Wrapper.module.css";

export const Wrapper: Component = (props) => (
  <div className={styles.Wrapper}>{props.children}</div>
);
