import connect from "connect";
import fs from "fs-extra";
import glob from "glob";
import { Server } from "http";
import path from "path";
import * as vite from "vite";
import viteReactJsx from "vite-react-jsx";

const frameworkConfiguration = {
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

async function main(options: {
  framework: "react" | "solid" | "svelte" | "vue";
  projectPath: string;
  filePathPattern: string;
  ports: readonly [number, number];
}) {
  const [httpPort, hmrPort] = options.ports;
  const relativeFilePaths = glob.sync(options.filePathPattern, {
    ignore: "**/node_modules/**",
    cwd: options.projectPath,
  });
  const frameworkConfig = frameworkConfiguration[options.framework];
  const rendererContent = `${await fs.readFile(
    path.join(__dirname, "renderers", options.framework + ".js"),
    "utf8"
  )}
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

  renderScreenshots(components).then(__done__).catch(console.error);
  `;
  const viteServer = await vite.createServer({
    root: options.projectPath,
    server: {
      middlewareMode: true,
      hmr: {
        port: hmrPort,
      },
    },
    plugins: [
      ...frameworkConfig.plugins,
      {
        name: "virtual",
        load: async (id) => {
          if (id !== "/__renderer__.jsx") {
            return null;
          }
          return rendererContent;
        },
      },
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
          <script type="module" src="/__renderer__.jsx"></script>
        </body>
      </html>    
      `
    );
    res.setHeader("Content-Type", "text/html").end(html);
  });
  app.use(viteServer.middlewares);
  let server!: Server;
  await new Promise((resolve) => (server = app.listen(httpPort, resolve)));
  console.log(`Ready on port ${httpPort}.`);
}

const framework: string = "solid";
switch (framework) {
  case "react":
    main({
      framework: "react",
      projectPath: "react-example",
      filePathPattern: "**/*.screenshot.@(jsx|tsx)",
      ports: [3000, 3001],
    }).catch(console.error);
    break;
  case "solid":
    main({
      framework: "solid",
      projectPath: "solid-example",
      filePathPattern: "**/*.screenshot.@(jsx|tsx)",
      ports: [3000, 3001],
    }).catch(console.error);
    break;
  case "svelte":
    main({
      framework: "svelte",
      projectPath: "svelte-example",
      filePathPattern: "**/*.screenshot.svelte",
      ports: [3000, 3001],
    }).catch(console.error);
    break;
  case "vue":
    main({
      framework: "vue",
      projectPath: "vue-example",
      filePathPattern: "**/*.screenshot.vue",
      ports: [3000, 3001],
    }).catch(console.error);
    break;
}
