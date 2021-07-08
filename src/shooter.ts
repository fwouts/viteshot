import { BasicPage, BrowserConfig } from "./config";

export async function shoot<Page extends BasicPage>({
  url,
  browserConfig,
}: {
  url: string;
  browserConfig: BrowserConfig<Page>;
}) {
  const browser = await browserConfig.launchBrowser();
  const page = await browser.newPage();
  let resolveDone!: () => void;
  const donePromise = new Promise<void>((resolve) => {
    resolveDone = resolve;
  });
  const screenshotPaths: string[] = [];
  await page.exposeFunction("__takeScreenshot__", async (name: string) => {
    const screenshotPath = await browserConfig.captureScreenshot(page, name);
    if (screenshotPath) {
      screenshotPaths.push(screenshotPath);
    }
  });
  await page.exposeFunction("__done__", resolveDone);
  await page.goto(url);
  await donePromise;
  await browser.close();
  return screenshotPaths;
}
