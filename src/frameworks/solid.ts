import { FrameworkConfiguration } from "./config";

export function solidConfiguration(): FrameworkConfiguration {
  return {
    packages: ["solid-js"],
    defaultImports: false,
    plugins: [],
  };
}
