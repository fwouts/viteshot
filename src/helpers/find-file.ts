import fs from "fs-extra";
import path from "path";

export async function findFileUpwards(
  ...possibleNames: string[]
): Promise<string | null> {
  let dirPath = process.cwd();
  while (dirPath !== path.dirname(dirPath)) {
    for (const name of possibleNames) {
      const filePath = path.join(dirPath, name);
      if (await fs.pathExists(filePath)) {
        return filePath;
      }
    }
    dirPath = path.dirname(dirPath);
  }
  return null;
}
