import percySnapshot from "@percy/puppeteer";
import puppeteer from "puppeteer";
import { BrowserConfig } from "../src/config";

export default (): BrowserConfig<puppeteer.Page> =>
  ({
    launchBrowser: async () => {
      const browser = await puppeteer.launch();
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
    captureScreenshot: async (page, name) => {
      console.log(`Capturing: ${name}`);
      return percySnapshot(page, name);
    },
  } as const);
