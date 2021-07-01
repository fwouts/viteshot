#!/usr/bin/env node

import fs from "fs-extra";
import getPort from "get-port";
import path from "path";
import { BasicPage, Config, DEFAULT_CONFIG } from "./config";
import { startRenderer } from "./renderer";
import { shoot } from "./shooter";

const CONFIG_FILE_NAME = "viteshot.config.js";

async function main() {
  const configFilePath = await findConfigFilePath();
  const config = require(configFilePath) as Partial<Config<any>>;
  return run(config, path.dirname(configFilePath));
}

async function run<Page extends BasicPage>(
  config: Partial<Config<Page>>,
  projectPath: string
) {
  const port = await getPort();
  if (!config.framework) {
    throw new Error(`Please specify \`framework\` in ${CONFIG_FILE_NAME}`);
  }
  if (!config.browser) {
    throw new Error(`Please specify \`browser\` in ${CONFIG_FILE_NAME}`);
  }
  const stopRenderer = await startRenderer({
    framework: config.framework,
    projectPath,
    filePathPattern: config.filePathPattern || DEFAULT_CONFIG.filePathPattern,
    port,
  });
  await shoot({
    url: `http://localhost:${port}`,
    browserConfig: config.browser,
  });
  await stopRenderer();
}

async function findConfigFilePath(): Promise<string> {
  let dirPath = process.cwd();
  while (dirPath !== path.dirname(dirPath)) {
    const filePath = path.join(dirPath, CONFIG_FILE_NAME);
    if (await fs.pathExists(filePath)) {
      return filePath;
    }
    dirPath = path.dirname(dirPath);
  }
  throw new Error(
    `Unable to find config file. Please make sure that ${CONFIG_FILE_NAME} is set up in your project.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
