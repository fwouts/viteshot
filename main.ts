import connect from "connect";
import glob from "glob";
import * as vite from "vite";

async function main(options: {
  projectPath: string;
  filePathPattern: string;
  ports: [number, number];
}) {
  const relativeFilePaths = glob.sync(options.filePathPattern, {
    cwd: options.projectPath,
  });
  const rendererContent = `
  import React from "react";
  import ReactDOM from "react-dom";
  ${relativeFilePaths
    .map(
      (componentFilePath, i) =>
        `import * as componentModule${i} from "/${componentFilePath}";`
    )
    .join("\n")}

  const components = [
    ${relativeFilePaths
      .map(
        (componentFilePath, i) =>
          `...Object.entries(componentModule${i}).map(([name, Component]) => {
            return [\`${componentFilePath}/\${name}\`, Component];
          }),`
      )
      .join("\n")}
  ];
  let current = 0;
  renderNext();

  function renderNext() {
    const [name, Component] = components[current];
    ReactDOM.render(<Component />, document.getElementById("root"));
    if (++current === components.length) {
      current = 0;
    }
    return name;
  }

  window.__renderNext__ = renderNext;
  `;
  const viteServer = await vite.createServer({
    root: options.projectPath,
    server: {
      middlewareMode: true,
      hmr: {
        overlay: false,
        port: options.ports[1],
      },
    },
    plugins: [
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
        <body>
          <div id="root"></div>
          <script type="module" src="../__renderer__.jsx"></script>
        </body>
      </html>    
      `
    );
    res.setHeader("Content-Type", "text/html").end(html);
  });
  app.use(viteServer.middlewares);
  app.listen(options.ports[0], () => {
    console.log("Server ready.");
  });
}

main({
  projectPath: "example",
  filePathPattern: "**/*.screenshot.@(jsx|tsx)",
  ports: [3000, 3001],
}).catch(console.error);
