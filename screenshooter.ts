import puppeteer from "puppeteer";

export async function shoot<
  Page extends {
    exposeFunction: puppeteer.Page["exposeFunction"];
    goto(url: string): Promise<unknown>;
  }
>(options: {
  url: string;
  launchBrowser(): Promise<{
    newPage(): Promise<Page>;
    close(): Promise<void>;
  }>;
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
}
