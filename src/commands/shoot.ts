import getPort from "get-port";
import { readConfig } from "../helpers/read-config";
import { startRenderer } from "../renderer";
import { shoot } from "../shooter";

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
  await shoot({
    url: `http://localhost:${port}`,
    browserConfig: config.browser,
  });
  await stopRenderer();
}
