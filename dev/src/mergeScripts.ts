import * as path from "node:path";
import * as fs from "node:fs/promises";
import convertYarnToJS from "./convert-yarn-to-js";

const dirPath = "src";
const fileExt = ".yarn";
const outDir = "dist/";
const outFile = "YarnNodes.json";
const outPath = "dist/YarnNodes.json";

try {
  const files = await fs.readdir(dirPath, { recursive: true });
  let nodes = [];

  for (const fileName of files) {
    const filePath = path.join(dirPath, fileName);
    const stats = await fs.stat(filePath);

    if (fileName.endsWith(fileExt) && stats.isFile()) {
      const fileHandle = await fs.open(filePath);

      const text = await fileHandle.readFile({
        encoding: "utf-8",
      });

      nodes = nodes.concat(convertYarnToJS(text));

      await fileHandle.close();
    }
  }

  if ((await fs.readdir(outDir)).includes(outFile)) await fs.rm(outPath);
  await fs.appendFile(path.join(outPath), JSON.stringify(nodes));
} catch (error) {
  console.error(error);
}
