import * as vite from "vite";
import { svgrPlugin } from "../plugins/svgr-plugin";
import { FrameworkConfiguration } from "./config";

export function reactConfiguration(
  config: {
    type: "react";
    svgr?: {
      componentName: string;
    };
  },
  viteConfig?: vite.UserConfig
): FrameworkConfiguration {
  const alias = viteConfig?.resolve?.alias;
  return {
    packages: ["react", "react-dom"],
    defaultImports: false,
    plugins: [
      {
        name: "react",
        transform(code: string, id: string) {
          // Since React 17, importing React is optional when building with webpack.
          // We do need the import with Vite, however.
          const reactImportRegExp = /import (\* as )?React[ ,]/;
          if (
            (id.endsWith(".js") || id.endsWith("sx")) &&
            !reactImportRegExp.test(code)
          ) {
            return `import React from "react";${code}`;
          }
          return null;
        },
      },
      svgrPlugin(
        // Only record aliases are supported, not arrays.
        alias && !Array.isArray(alias) ? (alias as Record<string, string>) : {},
        config.svgr?.componentName
      ),
    ],
  };
}
