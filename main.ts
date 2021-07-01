// TODO: Extract into a library.

import getPort from "get-port";
import { BasicPage, BrowserConfig, Config, DEFAULT_CONFIG } from "./config";
import { startRenderer } from "./renderer";
import { shoot } from "./screenshooter";
import { percyConfig } from "./screenshooters/percy";
import { playwrightConfig } from "./screenshooters/playwright";

async function main<Page extends BasicPage>(browser: BrowserConfig<Page>) {
  const port = await getPort();
  const url = `http://localhost:${port}`;
  let config: Config<Page>;
  switch (framework) {
    case "react":
      config = {
        ...DEFAULT_CONFIG,
        framework: "react",
        projectPath: "react-example",
        browser,
      };
      break;
    case "solid":
      config = {
        ...DEFAULT_CONFIG,
        framework: "solid",
        projectPath: "solid-example",
        browser,
      };
      break;
    case "svelte":
      config = {
        ...DEFAULT_CONFIG,
        framework: "svelte",
        projectPath: "svelte-example",
        browser,
      };
      break;
    case "vue":
      config = {
        ...DEFAULT_CONFIG,
        framework: "vue",
        projectPath: "vue-example",
        browser,
      };
      break;
    default:
      throw new Error(`Unsupported framework: ${framework}`);
  }
  const stopRenderer = await startRenderer({
    ...config,
    port,
  });
  await shoot({
    url,
    ...browser,
  });
  await stopRenderer();
}

const framework: string = "solid";

if (process.env["PERCY_SERVER_ADDRESS"]) {
  main(percyConfig()).catch(console.error);
} else {
  main(playwrightConfig()).catch(console.error);
}
