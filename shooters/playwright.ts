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
  return {
    shoot: async (url) => {
      const screenshotPaths = new Set<string>();
      let browser!: playwright.Browser;

      async function takeScreenshots(
        contextName: string,
        contextOptions: playwright.BrowserContextOptions
      ): Promise<void> {
        const context = await browser.newContext(contextOptions);
        const page = await context.newPage();
        page.setDefaultTimeout(DEFAULT_TIMEOUT_MILLIS);
        await page.exposeFunction(
          "__takeScreenshot__",
          async (name: string) => {
            // Ensure all images are loaded.
            // Source: https://stackoverflow.com/a/49233383
            await page.evaluate(async () => {
              const selectors = Array.from(document.querySelectorAll("img"));
              await Promise.all(
                selectors.map((img) => {
                  if (img.complete) {
                    return;
                  }
                  return new Promise((resolve) => {
                    img.addEventListener("load", resolve);
                    // If an image fails to load, ignore it.
                    img.addEventListener("error", resolve);
                  });
                })
              );
            });
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
        let errorMessage: string | null = null;
        let done!: (errorMessage?: string) => void;
        const donePromise = new Promise<void>((resolve) => {
          done = (receivedErrorMessage) => {
            if (receivedErrorMessage) {
              errorMessage = receivedErrorMessage;
            }
            resolve();
          };
        });
        await page.exposeFunction("__done__", done);
        await page.goto(url);
        await donePromise;
        if (errorMessage) {
          throw new Error(errorMessage);
        }
      }

      // Delete all old screenshots if they live in a top-level directory.
      if (prefixPath) {
        await fs.promises.rm(prefixPath, {
          recursive: true,
          force: true,
        });
      }

      try {
        browser = await browserType.launch();
        const pendingScreenshots: Array<Promise<void>> = [];
        for (const [contextName, contextOptions] of Object.entries(
          options.contexts || { "": {} }
        )) {
          pendingScreenshots.push(takeScreenshots(contextName, contextOptions));
        }
        await Promise.all(pendingScreenshots);
      } finally {
        if (browser) {
          await browser.close();
        }
      }
      return [...screenshotPaths];
    },
  };
};
