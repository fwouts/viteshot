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
  const screenshotFilePaths: string[] = [];
  await page.exposeFunction("__takeScreenshot__", async (name: string) => {
    const screenshotFilePath = await browserConfig.captureScreenshot(
      page,
      name
    );
    if (screenshotFilePath) {
      screenshotFilePaths.push(screenshotFilePath);
    }
  });
  await page.exposeFunction("__done__", resolveDone);
  await page.goto(url);
  await donePromise;
  await browser.close();
}
