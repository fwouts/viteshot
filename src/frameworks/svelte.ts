import { FrameworkConfiguration } from "./config";

export function svelteConfiguration(
  projectPath: string
): FrameworkConfiguration {
  // Note: This package is an optional peer dependency.
  const { svelte } = require(require.resolve("@sveltejs/vite-plugin-svelte", {
    paths: [projectPath],
  }));
  return {
    packages: ["svelte"],
    defaultImports: true,
    plugins: [svelte()],
  };
}
