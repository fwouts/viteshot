import path from "path";
import playwright from "playwright";
import { BrowserConfig } from "../src/config";

export default (
  browserType: playwright.BrowserType<{}>
): BrowserConfig<playwright.Page> =>
  ({
    launchBrowser: async () => {
      const browser = await browserType.launch();
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
      console.log(`Capturing: ${name}`);
      await page.screenshot({
        fullPage: true,
        path: path.join("__screenshots__", `${name}.png`),
      });
    },
  } as const);
