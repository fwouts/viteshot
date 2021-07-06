import fs from "fs-extra";
import path from "path";
import { Framework } from "../config";
import { fail } from "../helpers/fail";
import { findFileUpwards } from "../helpers/find-file";
import { success, warn } from "../helpers/print";

export async function initCommand(): Promise<void> {
  const packageJsonFilePath = await findFileUpwards("package.json");
  if (!packageJsonFilePath) {
    return fail(
      `Unable to find package.json. Are you in the correct directory?`
    );
  }
  const packageInfo = JSON.parse(
    await fs.readFile(packageJsonFilePath, "utf8")
  );
  const configFileName =
    packageInfo.type === "module"
      ? "viteshot.config.cjs"
      : "viteshot.config.js";
  const configFilePath = path.join(
    path.dirname(packageJsonFilePath),
    configFileName
  );
  if (await fs.pathExists(configFilePath)) {
    return fail(`${configFileName} already exists. Exiting early.`);
  }
  const dependencies = packageInfo.dependencies || {};
  let framework: Framework;
  if ("preact" in dependencies) {
    framework = "preact";
  } else if ("react" in dependencies) {
    framework = "react";
  } else if ("solid-js" in dependencies) {
    framework = "solid";
  } else if ("svelte" in dependencies) {
    framework = "svelte";
  } else if ("vue" in dependencies) {
    framework = "vue";
  } else {
    warn(
      `Unable to detect which framework is used in this project. Defaulting to react.`
    );
    framework = "react";
  }
  await fs.writeFile(
    configFilePath,
    `const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

module.exports = {
  framework: "${framework}",
  browser: playwrightShooter(playwright.chromium),
};
`,
    "utf8"
  );
  success(`${configFileName} was created successfully.`);
}
