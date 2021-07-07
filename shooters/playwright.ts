import path from "path";
import playwright from "playwright";
import { BrowserConfig } from "../src/config";

export default (
  browserType: playwright.BrowserType<{}>,
  options: {
    context?: playwright.BrowserContextOptions;
    output?: {
      prefixPath?: string;
      suffixPath?: string;
    };
  } = {}
): BrowserConfig<playwright.Page> =>
  ({
    launchBrowser: async () => {
      const browser = await browserType.launch();
      const context = await browser.newContext(options.context);
      return {
        newPage: async () => {
          const page = await context.newPage();
          page
            .on("pageerror", ({ message }) => console.error(message))
            .on("requestfailed", (request) =>
              console.warn(`${request.failure()!.errorText} ${request.url()}`)
            );
          return page;
        },
        close: () => browser.close(),
      };
    },
    captureScreenshot: async (page: playwright.Page, name: string) => {
      let prefixPath = options.output?.prefixPath;
      if (prefixPath === undefined) {
        prefixPath = "__screenshots__";
      }
      const suffixPath = options.output?.suffixPath || "";
      const dirPath = path.dirname(name);
      const baseName = path.basename(name);
      console.log(`Capturing: ${name}`);
      await page.screenshot({
        fullPage: true,
        path: path.join(prefixPath, dirPath, suffixPath, `${baseName}.png`),
      });
    },
  } as const);
