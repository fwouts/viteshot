import connect from "connect";
import * as vite from "vite";

async function main() {
  const viteServer = await vite.createServer({
    root: "example",
    server: {
      middlewareMode: true,
      hmr: {
        overlay: false,
        port: 3001,
      },
    },
    plugins: [
      {
        name: "virtual",
        load: async (id) => {
          if (id !== "/__screenshot__.jsx") {
            return null;
          }
          return `
          import React from "react";
          import ReactDOM from "react-dom";
          import App from "/src/App";

          ReactDOM.render(<App />, document.getElementById("root"));
          `;
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
        <head>
          <title>Screenshot</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="../__screenshot__.jsx"></script>
        </body>
      </html>    
      `
    );
    res.setHeader("Content-Type", "text/html").end(html);
  });
  app.use(viteServer.middlewares);
  app.listen(3000, () => {
    console.log("Server ready.");
  });
}

main().catch(console.error);
