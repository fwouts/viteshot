import percySnapshot from "@percy/puppeteer";
import puppeteer from "puppeteer";
import { BrowserConfig } from "../src/config";

export default (): BrowserConfig<puppeteer.Page> => ({
  launchBrowser: async () => {
    const browser = await puppeteer.launch();
    return {
      newPage: async () => {
        const page = await browser.newPage();
        page.on("pageerror", ({ message }) => console.error(message));
        return page;
      },
      close: () => browser.close(),
    };
  },
  captureScreenshot: async (page, name) => {
    console.log(`Capturing: ${name}`);
    await percySnapshot(page, name);
    return null;
  },
});
