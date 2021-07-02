#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { initCommand } from "./commands/init";
import { shootCommand } from "./commands/shoot";

yargs(hideBin(process.argv))
  .command("init", "set up an initial config", {}, async (args) => {
    await initCommand();
  })
  .command(["*", "shoot"], "captures screenshots", {}, async (args) => {
    await shootCommand();
  })
  .demandCommand().argv;
