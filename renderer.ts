import connect from "connect";
import glob from "glob";
import { Server } from "http";
import * as vite from "vite";
import viteReactJsx from "vite-react-jsx";

async function main(options: {
  projectPath: string;
  filePathPattern: string;
  ports: readonly [number, number];
}) {
  const [httpPort, hmrPort] = options.ports;
  const relativeFilePaths = glob.sync(options.filePathPattern, {
    ignore: "**/node_modules/**",
    cwd: options.projectPath,
  });
  const rendererContent = `
  import ReactDOM from "react-dom";
  ${relativeFilePaths
    .map(
      (componentFilePath, i) =>
        `import * as componentModule${i} from "/${componentFilePath}";`
    )
    .join("\n")}

  const components = [
    ${relativeFilePaths
      .map((componentFilePath, i) => {
        const [componentDir] = componentFilePath.split(".");
        return `...Object.entries(componentModule${i}).map(([name, Component]) => {
            return [\`${componentDir}/\${name}\`, Component];
          }),`;
      })
      .join("\n")}
  ];

  for (const [name, Component] of components) {
    ReactDOM.render(<Component />, document.getElementById("root"));
    if (Component.beforeScreenshot) {
      await Component.beforeScreenshot(document.getElementById("root"));
    }
    await __takeScreenshot__(name);
  }
  __done__();
  `;
  const viteServer = await vite.createServer({
    root: options.projectPath,
    server: {
      middlewareMode: true,
      hmr: {
        overlay: false,
        port: hmrPort,
      },
    },
    plugins: [
      viteReactJsx(),
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

main({
  projectPath: "react-example",
  filePathPattern: "**/*.screenshot.@(jsx|tsx)",
  ports: [3000, 3001],
}).catch(console.error);
