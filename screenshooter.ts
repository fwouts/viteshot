import percySnapshot from "@percy/puppeteer";
import path from "path";
import playwright from "playwright";
import puppeteer from "puppeteer";

async function main<
  Browser extends { newPage(): Promise<Page>; close(): Promise<void> },
  Page extends {
    exposeFunction: puppeteer.Page["exposeFunction"];
    goto(url: string): Promise<unknown>;
  }
>(options: {
  url: string;
  launchBrowser(): Promise<Browser>;
  captureScreenshot(page: Page, name: string): Promise<void>;
}) {
  const browser = await options.launchBrowser();
  const page = await browser.newPage();
  let resolveDone!: () => void;
  const donePromise = new Promise<void>((resolve) => {
    resolveDone = resolve;
  });
  await page.exposeFunction("__takeScreenshot__", async (name: string) => {
    await options.captureScreenshot(page, name);
  });
  await page.exposeFunction("__done__", resolveDone);
  await page.goto(options.url);
  await donePromise;
  await browser.close();
  console.log("Done.");
  process.exit(0);
}

const options = {
  url: "http://localhost:3000",
} as const;

if (process.env["PERCY_SERVER_ADDRESS"]) {
  // We're running inside Percy.
  main({
    ...options,
    launchBrowser: () => puppeteer.launch(),
    captureScreenshot: percySnapshot,
  }).catch(console.error);
} else {
  main<playwright.Browser, playwright.Page>({
    ...options,
    launchBrowser: () => playwright.chromium.launch(),
    captureScreenshot: async (page, name) => {
      await page.screenshot({
        fullPage: true,
        path: path.join("__screenshots__", `${name}.png`),
      });
    },
  }).catch(console.error);
}
