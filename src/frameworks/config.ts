import { Plugin } from "vite";

export interface FrameworkConfiguration {
  packages: string[];
  defaultImports: boolean;
  plugins: Plugin[];
}
