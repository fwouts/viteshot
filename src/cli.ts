#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { debugCommand } from "./commands/debug";
import { initCommand } from "./commands/init";
import { shootCommand } from "./commands/shoot";

yargs(hideBin(process.argv))
  .command("init", "set up an initial config", {}, async (args) => {
    await initCommand();
  })
  .command(
    ["*", "shoot"],
    "captures screenshots",
    (yargs) => {
      return yargs
        .option("config", {
          alias: "c",
          describe: "Path of a config file",
          type: "string",
        })
        .option("push", {
          alias: "p",
          describe:
            "Automatically create a commit with updated screenshots and push it",
          type: "boolean",
        });
    },
    async (args) => {
      await shootCommand(args);
    }
  )
  .command(
    ["debug"],
    "starts the component server for debugging purposes",
    (yargs) => {
      return yargs.option("config", {
        alias: "c",
        describe: "Path of a config file",
        type: "string",
      });
    },
    async (args) => {
      await debugCommand(args);
    }
  )
  .demandCommand().argv;
