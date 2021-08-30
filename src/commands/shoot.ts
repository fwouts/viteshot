import getPort from "get-port";
import simpleGit from "simple-git";
import { fail } from "../helpers/fail";
import { info } from "../helpers/print";
import { readConfig } from "../helpers/read-config";
import { startRenderer } from "../renderer";

const MAIN_BRANCHES = new Set(["main", "master"]);

export async function shootCommand(options: {
  config?: string;
  push?: boolean;
}) {
  const config = await readConfig(options.config);
  const port = await getPort();
  let stopRenderer = async () => {};
  let screenshotPaths: string[];
  try {
    stopRenderer = await startRenderer({
      ...config,
      port,
    });
    screenshotPaths = await config.shooter.shoot(`http://localhost:${port}`);
  } catch (e) {
    return fail(`${e}`);
  } finally {
    await stopRenderer();
  }
  if (options.push) {
    const git = simpleGit();
    await git.addConfig("user.name", "🤖 ViteShot");
    await git.addConfig("user.email", "viteshot-bot@zenc.io");
    await git.add(screenshotPaths);
    const status = await git.status();
    const branch = await git.branch();
    if (status.files.length > 0) {
      if (MAIN_BRANCHES.has(branch.current)) {
        return fail(`🚨 Screenshots have changed on ${branch.current}!`);
      }
      await git.stash();
      await git.pull();
      await git.stash(["pop"]);
      await git.add(screenshotPaths);
      await git.commit("📸 Updated screenshots");
      await git.push();
      info("⚠️ Screenshots have been updated.");
    } else {
      info("✅ Screenshots have not changed.");
    }
  }
  info("All done.");
  return process.exit(0);
}
