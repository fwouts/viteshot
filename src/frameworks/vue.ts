import { FrameworkConfiguration } from "./config";

export function vueConfiguration(): FrameworkConfiguration {
  return {
    packages: ["vue"],
    defaultImports: true,
    plugins: [],
  };
}
