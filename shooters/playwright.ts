import fs from "fs";
import path from "path";
import playwright from "playwright";
import { Shooter } from "../src/config";

const DEFAULT_TIMEOUT_MILLIS = 2 * 60 * 1000;

export default (
  browserType: playwright.BrowserType<{}>,
  options: {
    contexts?: Record<string, playwright.BrowserContextOptions>;
    output?: {
      prefixPath?: string;
      suffixPath?: string;
    };
  } = {}
): Shooter => {
  let prefixPath: string;
  let suffixPath: string;
  if (options.output) {
    prefixPath = options.output.prefixPath || "";
    suffixPath = options.output.suffixPath || "";
  } else {
    prefixPath = "";
    suffixPath = `__screenshots__/${process.platform}`;
  }
  const screenshotPaths = new Set<string>();
  return {
    shoot: async (url) => {
      // Delete all old screenshots if they live in a top-level directory.
      if (prefixPath) {
        await fs.promises.rm(prefixPath, {
          recursive: true,
          force: true,
        });
      }
      let browser!: playwright.Browser;
      try {
        browser = await browserType.launch();
        const pages = Object.entries(options.contexts || { "": {} }).map(
          async ([contextName, contextOptions]) => {
            const context = await browser.newContext(contextOptions);
            const page = await context.newPage();
            page.setDefaultTimeout(DEFAULT_TIMEOUT_MILLIS);
            await page.exposeFunction(
              "__takeScreenshot__",
              async (name: string) => {
                const dirPath = path.dirname(name);
                const baseName = path.basename(name);
                const screenshotPath = path.resolve(
                  prefixPath,
                  dirPath,
                  suffixPath,
                  contextName,
                  `${baseName}.png`
                );
                const screenshotDirPath = path.dirname(screenshotPath);
                if (suffixPath && !screenshotPaths.has(screenshotDirPath)) {
                  // Ensure the directory is clean (delete old screenshots).
                  screenshotPaths.add(screenshotDirPath);
                  await fs.promises.rm(screenshotDirPath, {
                    recursive: true,
                    force: true,
                  });
                }
                console.log(
                  `Capturing: ${path.relative(process.cwd(), screenshotPath)}`
                );
                await page.screenshot({
                  fullPage: true,
                  path: screenshotPath,
                });
              }
            );
            let done!: (errorMessage?: string) => void;
            const donePromise = new Promise<void>((resolve, reject) => {
              done = (errorMessage) => {
                if (errorMessage) {
                  reject(errorMessage);
                }
                resolve();
              };
            });
            await page.exposeFunction("__done__", done);
            await page.goto(url);
            return donePromise;
          }
        );
        await Promise.all(pages);
      } finally {
        if (browser) {
          await browser.close();
        }
      }
      return [...screenshotPaths];
    },
  };
};
