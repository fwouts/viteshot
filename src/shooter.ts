import { BasicPage, BrowserConfig } from "./config";
import { fail } from "./helpers/fail";

export async function shoot<Page extends BasicPage>({
  url,
  browserConfig,
}: {
  url: string;
  browserConfig: BrowserConfig<Page>;
}) {
  const browser = await browserConfig.launchBrowser();
  const page = await browser.newPage();
  let done!: (errorMessage?: string) => void;
  let errorMessage: string | null = null;
  const donePromise = new Promise<void>((resolve) => {
    done = (receivedErrorMessage) => {
      if (receivedErrorMessage) {
        errorMessage = receivedErrorMessage;
      }
      resolve();
    };
  });
  const screenshotPaths: string[] = [];
  await page.exposeFunction("__takeScreenshot__", async (name: string) => {
    const screenshotPath = await browserConfig.captureScreenshot(page, name);
    if (screenshotPath) {
      screenshotPaths.push(screenshotPath);
    }
  });
  await page.exposeFunction("__done__", done);
  await page.goto(url);
  await donePromise;
  await browser.close();
  if (errorMessage) {
    return fail(errorMessage);
  }
  return screenshotPaths;
}
