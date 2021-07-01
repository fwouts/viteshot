export interface Config<Page extends BasicPage> {
  framework: Framework;
  filePathPattern: string;
  browser: BrowserConfig<Page>;
}

export interface BrowserConfig<Page extends BasicPage> {
  launchBrowser(): Promise<{
    newPage(): Promise<Page>;
    close(): Promise<void>;
  }>;
  captureScreenshot(page: Page, name: string): Promise<void>;
}

export const DEFAULT_CONFIG = {
  filePathPattern: "**/*.screenshot.@(jsx|tsx|vue|svelte)",
} as const;

export type Framework = "react" | "solid" | "svelte" | "vue";

export interface BasicPage {
  exposeFunction(name: string, f: Function): Promise<void>;
  goto(url: string): Promise<unknown>;
}
