import percySnapshot from "@percy/puppeteer";
import puppeteer from "puppeteer";
import { Shooter } from "../src/config";

export default (): Shooter => ({
  shoot: async (url) => {
    let browser!: puppeteer.Browser;
    try {
      browser = await puppeteer.launch();
      const page = await browser.newPage();
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
      await page.exposeFunction("__takeScreenshot__", async (name: string) => {
        console.log(`Capturing: ${name}`);
        await percySnapshot(page, name);
      });
      await page.exposeFunction("__done__", done);
      await page.goto(url);
      await donePromise;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      return [];
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  },
});
