import puppeteer from "puppeteer";
import { BrowserConfig } from "./config";

export async function shoot<
  Page extends {
    exposeFunction: puppeteer.Page["exposeFunction"];
    goto(url: string): Promise<unknown>;
  }
>({ url, browserConfig }: { url: string; browserConfig: BrowserConfig<Page> }) {
  const browser = await browserConfig.launchBrowser();
  const page = await browser.newPage();
  let resolveDone!: () => void;
  const donePromise = new Promise<void>((resolve) => {
    resolveDone = resolve;
  });
  await page.exposeFunction("__takeScreenshot__", async (name: string) => {
    await browserConfig.captureScreenshot(page, name);
  });
  await page.exposeFunction("__done__", resolveDone);
  await page.goto(url);
  await donePromise;
  await browser.close();
}
