import * as Preact from "preact";
import styles from "./Wrapper.module.css";

export const Wrapper: Preact.FunctionalComponent = (props) => (
  <div className={styles.Wrapper}>{props.children}</div>
);
