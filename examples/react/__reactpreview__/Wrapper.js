import styles from "./Wrapper.module.css";

export const Wrapper = (props) => (
  <div className={styles.Wrapper}>{props.children}</div>
);
