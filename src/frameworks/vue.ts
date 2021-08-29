import { FrameworkConfiguration } from "./config";

export function vueConfiguration(projectPath: string): FrameworkConfiguration {
  // Note: This package is an optional peer dependency.
  const vue = require(require.resolve("@vitejs/plugin-vue", {
    paths: [projectPath],
  }));
  return {
    packages: ["vue"],
    defaultImports: true,
    plugins: [vue()],
  };
}
