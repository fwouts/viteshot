import { FrameworkConfiguration } from "./config";

export function preactConfiguration(): FrameworkConfiguration {
  return {
    packages: ["preact"],
    defaultImports: false,
    plugins: [
      {
        name: "preact",
        config() {
          return {
            esbuild: {
              jsxFactory: "h",
              jsxFragment: "Fragment",
            },
            resolve: {
              alias: {
                "react-dom": "preact/compat",
                react: "preact/compat",
              },
            },
          };
        },
        transform(code: string, id: string) {
          if (id.endsWith("sx") && !code.includes(`from "preact"`)) {
            return `import { h } from 'preact';\n${code}`;
          }
          return null;
        },
      },
    ],
  };
}
