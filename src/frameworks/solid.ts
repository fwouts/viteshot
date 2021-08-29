import { FrameworkConfiguration } from "./config";

export function solidConfiguration(
  projectPath: string
): FrameworkConfiguration {
  // Note: This package is an optional peer dependency.
  const solidPlugin = require(require.resolve("vite-plugin-solid", {
    paths: [projectPath],
  }));
  return {
    packages: ["solid-js"],
    defaultImports: false,
    plugins: [solidPlugin()],
  };
}
