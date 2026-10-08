import fs from "node:fs";
import { getRegistry, resolveTemplatePath } from "./index.mjs";

const registry = getRegistry();
const missing = [];
for (const item of registry.items) {
  if (item.files.length === 0) missing.push(`${item.id}: no template files`);
  for (const file of item.files) {
    if (!fs.existsSync(resolveTemplatePath(file.source))) missing.push(`${item.id}: ${file.source}`);
  }
}
if (missing.length > 0) {
  console.error("Diagram registry validation failed.");
  for (const entry of missing) console.error(`  ERROR: ${entry}`);
  process.exit(1);
}
const totalFiles = registry.items.reduce((sum, item) => sum + item.files.length, 0);
console.log(`Diagram registry valid: ${registry.items.length} items, ${totalFiles} template files.`);
