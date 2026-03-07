import fs from "node:fs";
import { getRegistry, resolveTemplatePath } from "./index.mjs";

const registry = getRegistry();
const missing = [];

for (const item of registry.items) {
  for (const file of item.files) {
    const absolutePath = resolveTemplatePath(file.source);
    if (!fs.existsSync(absolutePath)) {
      missing.push(`${item.id}: ${file.source}`);
    }
  }
}

if (missing.length > 0) {
  console.error("Registry validation failed.");
  for (const entry of missing) {
    console.error(`- ${entry}`);
  }
  process.exit(1);
}

console.log(
  `Registry valid: ${registry.items.length} items, ${registry.items.reduce((sum, item) => sum + item.files.length, 0)} template files.`,
);
