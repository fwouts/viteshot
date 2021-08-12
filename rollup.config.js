import commonjs from "@rollup/plugin-commonjs";
import fs from "fs";
import path from "path";
import { preserveShebangs } from "rollup-plugin-preserve-shebangs";
import typescript from "rollup-plugin-typescript2";

const typescriptPlugin = typescript({
  useTsconfigDeclarationDir: true,
  tsconfigOverride: {
    compilerOptions: {
      module: "esnext",
      declarationDir: "dist",
    },
  },
});

export default [
  {
    preserveModules: true,
    input: ["src/cli.ts"],
    output: [{ dir: "dist/lib", format: "cjs" }],
    plugins: [
      typescriptPlugin,
      preserveShebangs(),
      commonjs({
        namedExports: {
          "@svgr/core": ["default"],
        },
      }),
    ],
  },
  {
    preserveModules: true,
    input: allFiles("shooters"),
    output: [{ dir: "dist/shooters", format: "cjs" }],
    plugins: [typescriptPlugin],
  },
  {
    preserveModules: true,
    input: allFiles("renderers"),
    output: [{ dir: "dist/renderers", format: "esm" }],
    plugins: [typescriptPlugin],
  },
];

function allFiles(dirPath) {
  return fs.readdirSync(dirPath).flatMap((f) => {
    const filePath = path.join(dirPath, f);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      return [filePath];
    } else if (stat.isDirectory()) {
      return [...allFiles(filePath)];
    } else {
      return [];
    }
  });
}
