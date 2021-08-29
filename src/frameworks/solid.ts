// @ts-ignore This package is not installed by default.
import solidPlugin from "vite-plugin-solid";
import { FrameworkConfiguration } from "./config";

export function solidConfiguration(): FrameworkConfiguration {
  return {
    packages: ["solid-js"],
    defaultImports: false,
    plugins: [solidPlugin()],
  };
}
