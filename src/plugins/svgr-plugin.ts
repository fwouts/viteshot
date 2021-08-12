// @ts-ignore untyped (pending https://github.com/gregberge/svgr/pull/555)
import * as svgr from "@svgr/core";
import * as esbuild from "esbuild";
import fs from "fs-extra";
import path from "path";
import * as vite from "vite";

export function svgrPlugin(
  alias: Record<string, string>,
  componentName?: string
): vite.Plugin {
  return {
    name: "vite:svgr",
    async transform(code, id) {
      if (!id.endsWith(".svg")) {
        return;
      }
      let filePath = id;
      for (const [mapFrom, mapTo] of Object.entries(alias)) {
        const matchStart = path.join(path.sep, mapFrom);
        if (id.startsWith(matchStart)) {
          filePath = path.join(mapTo, path.relative(matchStart, id));
        }
      }
      if (!(await fs.pathExists(filePath))) {
        console.warn(`Unable to resolve SVG file: ${id}`);
        return;
      }
      const svg = await fs.readFile(filePath, "utf8");
      const generatedSvgrCode: string = await svgr(
        svg,
        {},
        { componentName: "ReactComponent" }
      );
      const componentCode = generatedSvgrCode.replace(
        "export default ReactComponent",
        `export { ReactComponent as ${componentName} }`
      );
      const res = await esbuild.transform(
        (componentName !== "default" ? code : "") + componentCode,
        {
          loader: "jsx",
        }
      );
      return {
        code: res.code,
      };
    },
  };
}
