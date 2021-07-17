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
          if (id.endsWith("sx") && !code.includes(`import React`)) {
            return `import React from 'react';\n${code}`;
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
