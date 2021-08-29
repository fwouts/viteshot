import { FrameworkConfiguration } from "./config";

export function solidConfiguration(
  projectPath: string
): FrameworkConfiguration {
  // Note: This package is not installed by default.
  const solidPlugin = require(require.resolve("vite-plugin-solid", {
    paths: [projectPath],
  }));
  return {
    packages: ["solid-js"],
    defaultImports: false,
    plugins: [solidPlugin()],
  };
}
