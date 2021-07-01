declare global {
  interface Window {
    __takeScreenshot__(name: string): Promise<void>;
    __done__(): Promise<void>;
  }
}

export {};
