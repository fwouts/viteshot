import * as vite from "vite";

export interface UserConfig {
  framework: Framework;
  filePathPattern: string;
  projectPath: string;
  wrapper?: WrapperConfig;
  shooter: Shooter;
  vite?: vite.UserConfig;
}

export interface WrapperConfig {
  path: string;
  componentName: string;
}
export interface Shooter {
  shoot(url: string): Promise<string[]>;
}

export type Framework = "preact" | "react" | "solid" | "svelte" | "vue";
