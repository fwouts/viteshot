import chalk from "chalk";

export function info(message: string) {
  console.log(message);
}

export function success(message: string) {
  console.log(chalk.green(message));
}

export function warn(message: string) {
  console.warn(chalk.yellow(message));
}
