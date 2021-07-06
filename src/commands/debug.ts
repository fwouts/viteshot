import getPort from "get-port";
import { readConfig } from "../helpers/config";
import { info } from "../helpers/print";
import { startRenderer } from "../renderer";

export async function debugCommand(options: { config?: string }) {
  const config = await readConfig(options.config);
  const port = await getPort();
  await startRenderer({
    framework: config.framework,
    projectPath: config.projectPath,
    filePathPattern: config.filePathPattern,
    port,
  });
  info(`Debug server running at http://localhost:${port}`);
}
