import fs from "fs";
import path from "path";
import { preserveShebangs } from "rollup-plugin-preserve-shebangs";
import typescript from "rollup-plugin-typescript2";

export default [
  {
    preserveModules: true,
    input: ["src/cli.ts"],
    output: [{ dir: "dist/lib", format: "cjs" }],
    plugins: [typescript(), preserveShebangs()],
  },
  {
    preserveModules: true,
    input: allFiles("shooters"),
    output: [{ dir: "dist/shooters", format: "cjs" }],
    plugins: [typescript()],
  },
  {
    preserveModules: true,
    input: allFiles("renderers"),
    output: [{ dir: "dist/renderers", format: "esm" }],
    plugins: [typescript()],
  },
];

function allFiles(dirPath) {
  return fs.readdirSync(dirPath).map((f) => path.join(dirPath, f));
}
