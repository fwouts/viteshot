import getPort from "get-port";
import simpleGit from "simple-git";
import { fail } from "../helpers/fail";
import { info } from "../helpers/print";
import { readConfig } from "../helpers/read-config";
import { startRenderer } from "../renderer";
import { shoot } from "../shooter";

const MAIN_BRANCHES = new Set(["main", "master"]);

export async function shootCommand(options: {
  config?: string;
  push?: boolean;
}) {
  const config = await readConfig(options.config);
  process.chdir(config.projectPath);
  const port = await getPort();
  const stopRenderer = await startRenderer({
    ...config,
    port,
  });
  const screenshotFilePaths = await shoot({
    url: `http://localhost:${port}`,
    browserConfig: config.browser,
  });
  await stopRenderer();
  if (options.push) {
    const git = simpleGit();
    await git.addConfig("user.name", "🤖 Viteshot");
    await git.addConfig("user.email", "viteshot-bot@zenc.io");
    await git.add(screenshotFilePaths);
    await git.stash();
    await git.pull();
    await git.stash(["pop"]);
    const status = await git.status();
    const branch = await git.branch();
    if (status.files.length > 0) {
      if (MAIN_BRANCHES.has(branch.current)) {
        return fail(`🚨 Screenshots have changed on ${branch.current}!`);
      }
      await git.commit("📸 Updated screenshots");
      await git.push();
      info("⚠️ Screenshots have been updated.");
    } else {
      info("✅ Screenshots have not changed.");
    }
  }
  return;
}
