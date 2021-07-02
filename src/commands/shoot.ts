#!/usr/bin/env node

import getPort from "get-port";
import path from "path";
import { BasicPage, Config, DEFAULT_CONFIG } from "../config";
import { fail } from "../helpers/fail";
import { findFileUpwards } from "../helpers/find-file";
import { startRenderer } from "../renderer";
import { shoot } from "../shooter";

const CONFIG_FILE_NAMES = ["viteshot.config.js", "viteshot.config.cjs"];

export async function shootCommand() {
  const configFilePath = await findFileUpwards(...CONFIG_FILE_NAMES);
  if (!configFilePath) {
    return fail(
      `Could not find viteshot config file. Please run \`viteshot init\` to set it up.`
    );
  }
  const config = require(configFilePath) as Partial<Config<any>>;
  return run(config, configFilePath);
}

async function run<Page extends BasicPage>(
  config: Partial<Config<Page>>,
  configFilePath: string
) {
  const configFileName = path.basename(configFilePath);
  const port = await getPort();
  if (!config.framework) {
    throw new Error(`Please specify \`framework\` in ${configFileName}`);
  }
  if (!config.browser) {
    throw new Error(`Please specify \`browser\` in ${configFileName}`);
  }
  const stopRenderer = await startRenderer({
    framework: config.framework,
    projectPath: path.dirname(configFilePath),
    filePathPattern: config.filePathPattern || DEFAULT_CONFIG.filePathPattern,
    port,
  });
  await shoot({
    url: `http://localhost:${port}`,
    browserConfig: config.browser,
  });
  await stopRenderer();
}
