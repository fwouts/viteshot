import { FrameworkConfiguration } from "./config";

export function solidConfiguration(): FrameworkConfiguration {
  // Note: This package is not installed by default.
  const solidPlugin = require("vite-plugin-solid");
  return {
    packages: ["solid-js"],
    defaultImports: false,
    plugins: [solidPlugin()],
  };
}
