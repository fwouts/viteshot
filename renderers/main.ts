/// <reference types="vite/client" />

declare global {
  interface Window {
    __takeScreenshot__(name: string): Promise<void>;
    __done__(error?: string): Promise<void>;
  }
}

// Default implementation of functions normally injected by the browser.
//
// This is especially useful when running the `debug` command.
if (!window.__takeScreenshot__) {
  window.__takeScreenshot__ = (name) => {
    console.log(`Simulating screenshot: ${name}`);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };
  window.__done__ = async (errorMessage) => {
    if (errorMessage) {
      console.error(`Done with error: ${errorMessage}`);
    } else {
      console.log(`Done without errors.`);
    }
  };
}

// Useful polyfills.
const w = window as any;
w.global ||= window;
w.process ||= {};

// Catch runtime errors and stop immediately.
window.onerror = (event, source, lineno, colno, error) => {
  window.__done__((error && (error.stack || error.message)) || "Unknown error");
};

// Catch Vite errors and also stop immediately.
// @ts-ignore Fixing this error would break ts-node-dev.
import.meta.hot?.on("vite:error", (payload) => {
  window.__done__(payload.err.message);
});
