import fs from "fs";
import path from "path";
import playwright from "playwright";
import { BasicPage, BrowserConfig } from "../src/config";

const DEFAULT_TIMEOUT_MILLIS = 2 * 60 * 1000;

interface PlaywrightMetaPage extends BasicPage {
  screenshot(page: string): Promise<void>;
}

export default (
  browserType: playwright.BrowserType<{}>,
  options: {
    contexts?: Record<string, playwright.BrowserContextOptions>;
    output?: {
      prefixPath?: string;
      suffixPath?: string;
    };
  } = {}
): BrowserConfig<PlaywrightMetaPage> => {
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
      const contexts = await Promise.all(
        Object.entries(options.contexts || { "": {} }).map(
          async ([name, contextOptions]) => ({
            name,
            context: await browser.newContext(contextOptions),
          })
        )
      );
      return {
        newPage: async () => {
          const pages: Record<string, playwright.Page> = {};
          for (const { name, context } of contexts) {
            const page = await context.newPage();
            page.setDefaultTimeout(DEFAULT_TIMEOUT_MILLIS);
            page.on("pageerror", ({ message }) => console.error(message));
            pages[name] = page;
          }
          return {
            exposeFunction: async (functionName, f) => {
              await Promise.all(
                Object.values(pages).map((page) =>
                  page.exposeFunction(functionName, f)
                )
              );
            },
            goto: async (url) => {
              await Promise.all(
                Object.values(pages).map((page) => page.goto(url))
              );
            },
            screenshot: async (screenshotPath: string) => {
              const dirPath = path.dirname(screenshotPath);
              const baseName = path.basename(screenshotPath);
              await Promise.all(
                Object.entries(pages).map(([contextName, page]) => {
                  const filePath = path.join(
                    dirPath,
                    contextName,
                    `${baseName}.png`
                  );
                  console.log(
                    `Capturing: ${path.relative(process.cwd(), filePath)}`
                  );
                  return page.screenshot({
                    fullPage: true,
                    path: filePath,
                  });
                })
              );
            },
          };
        },
        close: () => browser.close(),
      };
    },
    captureScreenshot: async (page: PlaywrightMetaPage, name: string) => {
      const dirPath = path.dirname(name);
      const baseName = path.basename(name);
      const screenshotPath = path.resolve(
        prefixPath,
        dirPath,
        suffixPath,
        baseName
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
      await page.screenshot(screenshotPath);
      return screenshotDirPath;
    },
  };
};
