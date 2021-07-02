import chalk from "chalk";

export function fail(message: string) {
  console.error(chalk.red(message));
  return process.exit(1);
}
