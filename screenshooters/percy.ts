import percySnapshot from "@percy/puppeteer";
import puppeteer from "puppeteer";
import { BrowserConfig } from "../config";

export const percyConfig = (): BrowserConfig<puppeteer.Page> =>
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
    captureScreenshot: percySnapshot,
  } as const);
