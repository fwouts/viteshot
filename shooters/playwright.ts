import fs from "fs";
import path from "path";
import playwright from "playwright";
import { BrowserConfig } from "../src/config";

const DEFAULT_TIMEOUT_MILLIS = 2 * 60 * 1000;

export default (
  browserType: playwright.BrowserType<{}>,
  options: {
    context?: playwright.BrowserContextOptions;
    output?: {
      prefixPath?: string;
      suffixPath?: string;
    };
  } = {}
): BrowserConfig<playwright.Page> => {
  let prefixPath: string;
  let suffixPath: string;
  if (options.output) {
    prefixPath = options.output.prefixPath || "";
    suffixPath = options.output.suffixPath || "";
  } else {
    prefixPath = "";
    suffixPath = `__screenshots__/${process.platform}`;
  }
  const seenDirPaths = new Set<string>();
  return {
    launchBrowser: async () => {
      // Delete all old screenshots if they live in a top-level directory.
      if (prefixPath) {
        await fs.promises.rm(prefixPath, {
          recursive: true,
          force: true,
        });
      }
      // Start the browser.
      const browser = await browserType.launch();
      const context = await browser.newContext(options.context);
      return {
        newPage: async () => {
          const page = await context.newPage();
          page.setDefaultTimeout(DEFAULT_TIMEOUT_MILLIS);
          page.on("pageerror", ({ message }) => console.error(message));
          return page;
        },
        close: () => browser.close(),
      };
    },
    captureScreenshot: async (page: playwright.Page, name: string) => {
      const dirPath = path.dirname(name);
      const baseName = path.basename(name);
      const screenshotPath = path.resolve(
        prefixPath,
        dirPath,
        suffixPath,
        `${baseName}.png`
      );
      const screenshotDirPath = path.dirname(screenshotPath);
      if (suffixPath && !seenDirPaths.has(screenshotDirPath)) {
        // Ensure the directory is clean (delete old screenshots).
        seenDirPaths.add(screenshotDirPath);
        await fs.promises.rm(screenshotDirPath, {
          recursive: true,
          force: true,
        });
      }
      console.log(`Capturing: ${name}`);
      await page.screenshot({
        fullPage: true,
        path: screenshotPath,
      });
      return screenshotPath;
    },
  };
};
