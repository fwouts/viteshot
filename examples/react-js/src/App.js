import styles from "./App.module.scss";
import { ReactComponent as Logo } from "./logo.svg";

function App() {
  return (
    <div className={styles["App"]}>
      <header className={styles["App-header"]}>
        <Logo className={styles["App-logo"]} alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className={styles["App-link"]}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
