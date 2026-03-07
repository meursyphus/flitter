import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distPackagePath = path.resolve("dist/package.json");
const rawPackage = await readFile(distPackagePath, "utf8");
const pkg = JSON.parse(rawPackage);

pkg.main = "./index.cjs";
pkg.module = "./index.js";
pkg.types = "./index.d.ts";
pkg.exports = {
  ".": {
    types: "./index.d.ts",
    import: "./index.js",
    require: "./index.cjs",
    default: "./index.js",
  },
  "./component/Tooltip": {
    types: "./component/Tooltip.d.ts",
    import: "./component/Tooltip.js",
    require: "./component/Tooltip.cjs",
    default: "./component/Tooltip.js",
  },
};

await writeFile(distPackagePath, `${JSON.stringify(pkg, null, 2)}\n`);
