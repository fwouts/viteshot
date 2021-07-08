import { info } from "../helpers/print";
import { readConfig } from "../helpers/read-config";
import { startRenderer } from "../renderer";

export async function debugCommand(options: {
  config?: string;
  port?: number;
}) {
  const config = await readConfig(options.config);
  const port = options.port || 3130;
  await startRenderer({
    ...config,
    port,
  });
  info(`Debug server running at http://localhost:${port}`);
}
