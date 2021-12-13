import connect from "connect";
import * as esbuild from "esbuild";
import fs from "fs-extra";
import glob from "glob";
import { Server } from "http";
import { promisify } from "node:util";
import path from "path";
import friendlyTypeImports from "rollup-plugin-friendly-type-imports";
import * as vite from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { FrameworkOptions, WrapperConfig } from "./config";

export async function startRenderer(options: {
  framework: FrameworkOptions;
  projectPath: string;
  filePathPattern: string;
  port: number;
  wrapper?: WrapperConfig;
  vite?: vite.UserConfig;
}) {
  process.chdir(options.projectPath);
  const relativeFilePaths = await promisify(glob)(options.filePathPattern, {
    ignore: "**/node_modules/**",
    cwd: options.projectPath,
  });
  if (relativeFilePaths.length === 0) {
    throw new Error(
      `No files found matching pattern: ${options.filePathPattern}`
    );
  }
  const frameworkConfig = await (async () => {
    const frameworkType = options.framework.type;
    switch (options.framework.type) {
      case "preact":
        const { preactConfiguration } = await import("./frameworks/preact");
        return preactConfiguration();
      case "react":
        const { reactConfiguration } = await import("./frameworks/react");
        return reactConfiguration(options.framework);
      case "solid":
        const { solidConfiguration } = await import("./frameworks/solid");
        return solidConfiguration(options.projectPath);
      case "svelte":
        const { svelteConfiguration } = await import("./frameworks/svelte");
        return svelteConfiguration(options.projectPath);
      case "vue":
        const { vueConfiguration } = await import("./frameworks/vue");
        return vueConfiguration(options.projectPath);
      default:
        throw new Error(`Invalid framework type: ${frameworkType}`);
    }
  })();
  const rendererDirPath = path.join(__dirname, "../renderers");
  // Support both production (.js) and development (.ts).
  const extension = (await fs.pathExists(path.join(rendererDirPath, "main.js")))
    ? ".js"
    : ".ts";
  const mainContent = await fs.readFile(
    path.join(rendererDirPath, "main" + extension),
    "utf8"
  );
  const rendererContent = `${await fs.readFile(
    path.join(rendererDirPath, options.framework.type + extension),
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
    configFile: false,
    server: {
      middlewareMode: true,
      hmr: {
        overlay: false,
      },
    },
    define: {
      "process.env": {},
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          // Ensure that esbuild doesn't crash when encountering JSX in .js files.
          // Credit: https://github.com/vitejs/vite/discussions/3448#discussioncomment-749919
          {
            name: "load-js-files-as-jsx",
            setup(build) {
              build.onLoad({ filter: /.*\.js$/ }, async (args) => ({
                loader: "jsx",
                contents: await fs.readFile(args.path, "utf8"),
              }));
            },
          },
        ],
      },
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
      friendlyTypeImports(),
      {
        name: "virtual",
        load: async (id) => {
          if (id === "/__main__.tsx") {
            return mainContent;
          }
          if (id === "/__renderer__.tsx") {
            return rendererContent;
          }
          if (id.endsWith(".js")) {
            const source = await fs.readFile(id, "utf8");
            const transformed = await esbuild.transform(source, {
              loader: "jsx",
              format: "esm",
              sourcefile: id,
            });
            return transformed;
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
    res.setHeader("Content-Type", "text/html");
    res.end(html);
  });
  app.use(viteServer.middlewares);
  let server!: Server;
  await new Promise((resolve) => (server = app.listen(options.port, resolve)));
  return async () => {
    await viteServer.close();
    await server.close();
  };
}
