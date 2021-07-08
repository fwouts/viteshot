import connect from "connect";
import fs from "fs-extra";
import glob from "glob";
import { Server } from "http";
import path from "path";
import { promisify } from "util";
import * as vite from "vite";
import { UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { Framework, WrapperConfig } from "./config";

const frameworkConfiguration = {
  preact: {
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
  },
  react: {
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
    ],
  },
  solid: {
    packages: ["solid-js"],
    defaultImports: false,
    plugins: [],
  },
  svelte: {
    packages: ["svelte"],
    defaultImports: true,
    plugins: [],
  },
  vue: {
    packages: ["vue"],
    defaultImports: true,
    plugins: [],
  },
} as const;

export async function startRenderer(options: {
  framework: Framework;
  projectPath: string;
  filePathPattern: string;
  port: number;
  wrapper?: WrapperConfig;
  vite?: UserConfig;
}) {
  process.chdir(options.projectPath);
  const relativeFilePaths = await promisify(glob)(options.filePathPattern, {
    ignore: "**/node_modules/**",
    cwd: options.projectPath,
  });
  const frameworkConfig = frameworkConfiguration[options.framework];
  const rendererDirPath = path.join(__dirname, "..", "renderers");
  // Support both production (.js) and development (.ts).
  const extension = (await fs.pathExists(path.join(rendererDirPath, "main.js")))
    ? ".js"
    : ".ts";
  const mainContent = await fs.readFile(
    path.join(rendererDirPath, "main" + extension),
    "utf8"
  );
  const rendererContent = `${await fs.readFile(
    path.join(rendererDirPath, options.framework + extension),
    "utf8"
  )}
  ${
    options.wrapper
      ? `import { ${options.wrapper.componentName} as Wrapper } from '/${options.wrapper.path}';`
      : "const Wrapper = null;"
  }
  ${relativeFilePaths
    .map(
      (componentFilePath, i) =>
        `import ${
          frameworkConfig.defaultImports ? "" : "* as "
        } componentModule${i} from "/${componentFilePath}";`
    )
    .join("\n")}

  const components = [
    ${relativeFilePaths
      .map((componentFilePath, i) => {
        const [componentBaseName] = componentFilePath.split(".");
        if (frameworkConfig.defaultImports) {
          return `[\`${componentBaseName}\`, componentModule${i}],`;
        } else {
          return `...Object.entries(componentModule${i}).map(([name, component]) => {
              return [\`${componentBaseName}-\${name}\`, component];
            }),`;
        }
      })
      .join("\n")}
  ];

  renderScreenshots(components, Wrapper).then(__done__).catch(e => {
    __done__(e.stack || e.message || "Unknown error");
  });
  `;
  const viteServer = await vite.createServer({
    root: options.projectPath,
    server: {
      middlewareMode: true,
      hmr: {
        overlay: false,
      },
    },
    optimizeDeps: {
      entries: [
        ...(options.wrapper ? [options.wrapper.path] : []),
        ...relativeFilePaths,
      ],
      include: [...frameworkConfig.packages],
    },
    ...options.vite,
    plugins: [
      ...frameworkConfig.plugins,
      tsconfigPaths(),
      {
        name: "virtual",
        load: async (id) => {
          if (id === "/__main__.tsx") {
            return mainContent;
          }
          if (id === "/__renderer__.tsx") {
            return rendererContent;
          }
          return null;
        },
      },
      ...(options.vite?.plugins || []),
    ],
  });
  const app = connect();
  app.use(async (req, res, next) => {
    if (req.originalUrl !== "/") {
      return next();
    }
    const html = await viteServer.transformIndexHtml(
      req.originalUrl,
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
          * {
            transition: none !important;
            animation: none !important;
          }

          .viteshot-error {
            color: #e00;
          }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/__main__.tsx"></script>
          <script type="module" src="/__renderer__.tsx"></script>
        </body>
      </html>    
      `
    );
    res.setHeader("Content-Type", "text/html").end(html);
  });
  app.use(viteServer.middlewares);
  let server!: Server;
  await new Promise((resolve) => (server = app.listen(options.port, resolve)));
  return async () => {
    await viteServer.close();
    await server.close();
  };
}
