import getPort from "get-port";
import { info } from "../helpers/print";
import { readConfig } from "../helpers/read-config";
import { startRenderer } from "../renderer";

export async function debugCommand(options: { config?: string }) {
  const config = await readConfig(options.config);
  const port = await getPort();
  await startRenderer({
    ...config,
    port,
  });
  info(`Debug server running at http://localhost:${port}`);
}
