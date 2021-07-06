import connect from "connect";
import fs from "fs-extra";
import glob from "glob";
import { Server } from "http";
import path from "path";
import { promisify } from "util";
import * as vite from "vite";
import { UserConfig } from "vite";
import viteReactJsx from "vite-react-jsx";
import { Framework, WrapperConfig } from "./config";

const frameworkConfiguration = {
  preact: {
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
      },
    ],
  },
  react: {
    defaultImports: false,
    plugins: [viteReactJsx()],
  },
  solid: {
    defaultImports: false,
    plugins: [],
  },
  svelte: {
    defaultImports: true,
    plugins: [],
  },
  vue: {
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
  const relativeFilePaths = await promisify(glob)(options.filePathPattern, {
    ignore: "**/node_modules/**",
    cwd: options.projectPath,
  });
  const frameworkConfig = frameworkConfiguration[options.framework];
  const rendererBasePath = path.join(
    __dirname,
    "..",
    "renderers",
    options.framework
  );
  // Support both production (.js) and development (.ts).
  const rendererPath = (await fs.pathExists(rendererBasePath + ".js"))
    ? rendererBasePath + ".js"
    : rendererBasePath + ".ts";
  const rendererContent = `${await fs.readFile(rendererPath, "utf8")}
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
              return [\`${componentBaseName}/\${name}\`, component];
            }),`;
        }
      })
      .join("\n")}
  ];

  if (!window.__takeScreenshot__) {
    // Debugging.
    window.__takeScreenshot__ = (name) => {
      console.log(\`Simulating screenshot: \${name}\`)
      return new Promise(resolve => setTimeout(resolve, 1000));
    };
    window.__done__ = () => {};
  }

  renderScreenshots(components, Wrapper).then(__done__).catch(console.error);
  `;
  const viteServer = await vite.createServer({
    root: options.projectPath,
    server: {
      middlewareMode: true,
    },
    ...options.vite,
    plugins: [
      ...frameworkConfig.plugins,
      {
        name: "virtual",
        load: async (id) => {
          if (id !== "/__renderer__.tsx") {
            return null;
          }
          return rendererContent;
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
        <style>
        * {
          transition: none !important;
          animation: none !important;
        }
        </style>
        <body>
          <div id="root"></div>
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
