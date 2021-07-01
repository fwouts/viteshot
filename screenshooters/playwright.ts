import path from "path";
import playwright from "playwright";
import { BrowserConfig } from "../config";

export const playwrightConfig = (): BrowserConfig<playwright.Page> =>
  ({
    launchBrowser: async () => {
      const browser = await playwright.chromium.launch();
      return {
        newPage: async () => {
          const page = await browser.newPage();
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
      await page.screenshot({
        fullPage: true,
        path: path.join("__screenshots__", `${name}.png`),
      });
    },
  } as const);
