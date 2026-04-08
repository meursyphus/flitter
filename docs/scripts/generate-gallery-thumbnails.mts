import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { parseHTML } from "linkedom";
import { AppRunner } from "flitter-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENTRIES_DIR = path.resolve(
  __dirname,
  "../src/app/chart/_data/gallery/entries",
);
const THUMBS_DIR = path.resolve(
  __dirname,
  "../src/app/chart/_data/gallery/thumbnails",
);
const SSR_SIZE = { width: 800, height: 500 };

function wrapSvg(innerHTML) {
  return `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'>${innerHTML}</svg>`;
}

async function renderEntry(entryPath) {
  const entryModule = await import(pathToFileURL(entryPath).href);

  if (typeof entryModule.createWidget !== "function") {
    throw new Error(`Missing createWidget export in ${path.basename(entryPath)}`);
  }

  const widget = entryModule.createWidget();
  const { document: _document, window: _window } = parseHTML("<svg></svg>");
  const svg = _document.querySelector("svg") as any;
  const runner = new AppRunner({
    view: svg,
    window: _window as any,
    document: _document as any,
    ssrSize: SSR_SIZE,
  });

  try {
    return wrapSvg(runner.runApp(widget));
  } finally {
    runner.dispose();
  }
}

async function main() {
  if (!fs.existsSync(ENTRIES_DIR)) {
    console.log("No entries directory found. Nothing to generate.");
    return;
  }

  fs.mkdirSync(THUMBS_DIR, { recursive: true });

  const files = fs
    .readdirSync(ENTRIES_DIR)
    .filter((file) => file.endsWith(".tsx"))
    .sort();

  for (const file of files) {
    const entryPath = path.join(ENTRIES_DIR, file);
    const thumbnailPath = path.join(THUMBS_DIR, file.replace(/\.tsx$/, ".svg"));
    const svg = await renderEntry(entryPath);
    fs.writeFileSync(thumbnailPath, svg);
    console.log(`Generated ${path.basename(thumbnailPath)}`);
  }

  console.log(`Done! Generated ${files.length} gallery thumbnails.`);
}

await main();
