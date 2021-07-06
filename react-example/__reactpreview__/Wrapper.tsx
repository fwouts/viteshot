import styles from "./Wrapper.module.css";

export const Wrapper: React.FC = (props) => (
  <div className={styles.Wrapper}>{props.children}</div>
);
