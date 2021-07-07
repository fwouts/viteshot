import fs from "fs-extra";
import path from "path";
import { BasicPage, DEFAULT_CONFIG, UserConfig } from "../config";
import { fail } from "./fail";
import { findFileUpwards } from "./find-file";

const CONFIG_FILE_NAMES = ["viteshot.config.js", "viteshot.config.cjs"];

export async function readConfig<Page extends BasicPage>(
  customConfigFilePath?: string
): Promise<UserConfig<Page>> {
  const configFilePath = customConfigFilePath
    ? path.resolve(customConfigFilePath)
    : await findFileUpwards(...CONFIG_FILE_NAMES);
  if (!configFilePath) {
    return fail(
      `Could not find viteshot config file. Please run \`viteshot init\` to set it up.`
    );
  }
  try {
    const stat = await fs.stat(configFilePath);
    if (!stat.isFile()) {
      return fail(`Expected to find a valid config file: ${configFilePath}`);
    }
  } catch {
    return fail(`Unable to access config file: ${configFilePath}`);
  }
  const config = require(configFilePath) as Partial<UserConfig<any>>;
  const configFileName = path.basename(configFilePath);
  if (!config.framework) {
    throw new Error(`Please specify \`framework\` in ${configFileName}`);
  }
  if (!config.browser) {
    throw new Error(`Please specify \`browser\` in ${configFileName}`);
  }
  return {
    framework: config.framework,
    browser: config.browser,
    projectPath: config.projectPath || path.dirname(configFilePath),
    filePathPattern: config.filePathPattern || DEFAULT_CONFIG.filePathPattern,
    vite: config.vite,
    wrapper: config.wrapper,
  };
}
