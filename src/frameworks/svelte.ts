import { FrameworkConfiguration } from "./config";

export function svelteConfiguration(): FrameworkConfiguration {
  return {
    packages: ["svelte"],
    defaultImports: true,
    plugins: [],
  };
}
