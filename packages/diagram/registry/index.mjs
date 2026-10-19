import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Source templates mirror the chart registry: entry, base, and selected style.
const registryRoot = path.dirname(fileURLToPath(import.meta.url));
const templatesRoot = path.join(registryRoot, "templates", "diagrams");

const SOURCE_PREFIX = "diagram:";

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function listFiles(relativeDir) {
  const absoluteDir = path.join(templatesRoot, relativeDir);
  if (!fs.existsSync(absoluteDir)) return [];
  const files = [];
  const walk = (currentDir) => {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }
      files.push(toPosix(path.relative(templatesRoot, entryPath)));
    }
  };
  walk(absoluteDir);
  return files.sort();
}

const diagrams = [{ name: "flow-diagram", styles: ["default"] }];

function styleItem(diagram, style) {
  const outputDir = diagram;
  return {
    id: outputDir,
    kind: "diagram-style",
    name: diagram,
    style,
    outputDir,
    dependencies: ["flitter-ui"],
    registryDependencies: [],
    files: [...listFiles(`${diagram}/base`), ...listFiles(`${diagram}/styles/${style}`), `${diagram}/index.ts`].map((source) => ({
      source: `${SOURCE_PREFIX}${source}`,
      target: toPosix(path.join(outputDir, path.relative(diagram, source).replace(`styles/${style}/`, "style/"))),
    })),
  };
}

export function resolveTemplatePath(source) {
  const relative = source.startsWith(SOURCE_PREFIX) ? source.slice(SOURCE_PREFIX.length) : source;
  return path.join(templatesRoot, relative);
}

export const diagramMetadata = {
  "flow-diagram": {
    componentName: "FlowDiagram",
    configTypes: { default: "DefaultFlowConfig" },
  },
};

export function getRegistry() {
  const items = [];
  for (const diagram of diagrams) {
    for (const style of diagram.styles) items.push(styleItem(diagram.name, style));
  }
  return {
    kind: "diagram",
    sourcePrefix: SOURCE_PREFIX,
    items,
    resolveTemplatePath,
    diagramMetadata,
    templatesRoot,
  };
}

export default getRegistry();
