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
          page.on("pageerror", ({ message }) => console.error(message));
          return page;
        },
        close: () => browser.close(),
      };
    },
    captureScreenshot: async (page: playwright.Page, name: string) => {
      let prefixPath: string;
      let suffixPath: string;
      if (options.output) {
        prefixPath = options.output.prefixPath || "";
        suffixPath = options.output.suffixPath || "";
      } else {
        prefixPath = "";
        suffixPath = `__screenshots__/${process.platform}`;
      }
      const dirPath = path.dirname(name);
      const baseName = path.basename(name);
      const screenshotPath = path.resolve(
        prefixPath,
        dirPath,
        suffixPath,
        `${baseName}.png`
      );
      console.log(`Capturing: ${name}`);
      await page.screenshot({
        fullPage: true,
        path: screenshotPath,
      });
      return screenshotPath;
    },
  } as const);
