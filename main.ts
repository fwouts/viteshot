import percySnapshot from "@percy/puppeteer";
import connect from "connect";
import glob from "glob";
import { Server } from "http";
import path from "path";
import playwright from "playwright";
import puppeteer from "puppeteer";
import * as vite from "vite";
import viteReactJsx from "vite-react-jsx";

async function main<
  Browser extends { newPage(): Promise<Page>; close(): Promise<void> },
  Page extends {
    exposeFunction: puppeteer.Page["exposeFunction"];
    goto(url: string): Promise<unknown>;
  }
>(options: {
  projectPath: string;
  filePathPattern: string;
  ports: readonly [number, number];
  launchBrowser(): Promise<Browser>;
  captureScreenshot(page: Page, name: string): Promise<void>;
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
  const browser = await options.launchBrowser();
  const page = await browser.newPage();
  let resolveDone!: () => void;
  const donePromise = new Promise<void>((resolve) => {
    resolveDone = resolve;
  });
  await page.exposeFunction("__takeScreenshot__", async (name: string) => {
    await options.captureScreenshot(page, name);
  });
  await page.exposeFunction("__done__", resolveDone);
  await page.goto(`http://localhost:${httpPort}`);
  await donePromise;
  await browser.close();
  await viteServer.close();
  server.close();
  console.log("Done.");
  process.exit(0);
}

const options = {
  projectPath: "example",
  filePathPattern: "**/*.screenshot.@(jsx|tsx)",
  ports: [3000, 3001],
} as const;

if (process.env["PERCY_SERVER_ADDRESS"]) {
  // We're running inside Percy.
  main({
    ...options,
    launchBrowser: () => puppeteer.launch(),
    captureScreenshot: percySnapshot,
  }).catch(console.error);
} else {
  main<playwright.Browser, playwright.Page>({
    ...options,
    launchBrowser: () => playwright.chromium.launch(),
    captureScreenshot: async (page, name) => {
      await page.screenshot({
        fullPage: true,
        path: path.join(options.projectPath, `${name}.png`),
      });
    },
  }).catch(console.error);
}
