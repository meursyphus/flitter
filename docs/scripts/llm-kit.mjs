import fs from "node:fs/promises";
import path from "node:path";
import { chartFamilies, coreConcepts, coreWidgets, novelPatterns } from "./llm-pack-data.mjs";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..");

function usage() {
  console.log(`Usage:
  pnpm llm:kit list
  pnpm llm:kit show <slug>
  pnpm llm:kit scaffold <slug> --output tmp/<slug>
`);
}

function quickStart(chart) {
  const styleLine =
    chart.supportsStyleArg && chart.supportedStyles.length > 0
      ? `  style: "${chart.supportedStyles[0]}",\n`
      : "";

  return `import Widget from "@flitterjs/react";
import ${chart.importName} from "./charts/${chart.slug}";

const widget = ${chart.importName}({
${styleLine}  data: ${chart.dataShape.trim()},
});

<Widget widget={widget} width="720px" height="420px" />`;
}

const registry = [
  ...chartFamilies.map((entry) => ({
    type: "chart",
    slug: entry.slug,
    title: entry.title,
    summary: entry.summary,
    docsPath: `/llm/chart/${entry.slug}.md`,
    sourcePaths: entry.sourcePaths,
    starter: quickStart(entry),
  })),
  ...novelPatterns.map((entry) => ({
    type: "pattern",
    slug: entry.slug,
    title: entry.title,
    summary: entry.summary,
    docsPath: `/llm/patterns/${entry.slug}.md`,
    sourcePaths: entry.sourcePaths,
    starter: `// Pattern: ${entry.title}\n// Build path:\n${entry.buildPath.map((step) => `// - ${step}`).join("\n")}`,
  })),
  ...coreWidgets.map((entry) => ({
    type: "widget",
    slug: entry.slug,
    title: entry.title,
    summary: entry.summary,
    docsPath: `/llm/core/widgets/${entry.slug}.md`,
    sourcePaths: entry.sourcePaths,
    starter: `import { ${entry.title} } from "flitter-ui";\n\n// Use when: ${entry.useWhen}\n`,
  })),
  ...coreConcepts.map((entry) => ({
    type: "concept",
    slug: entry.slug,
    title: entry.title,
    summary: entry.summary,
    docsPath: `/llm/core/concepts/${entry.slug}.md`,
    sourcePaths: entry.sourcePaths,
    starter: `// Concept: ${entry.title}\n${entry.points.map((point) => `// - ${point}`).join("\n")}`,
  })),
];

function findEntry(slug) {
  return registry.find((entry) => entry.slug === slug);
}

function getOption(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  return args[index + 1] ?? null;
}

async function scaffold(entry, outputDir) {
  const absoluteOutputDir = path.resolve(repoRoot, outputDir);
  const manifest = {
    generatedAt: new Date().toISOString(),
    ...entry,
  };
  const readme = `# ${entry.title}

Type: \`${entry.type}\`

${entry.summary}

Docs:

- \`${entry.docsPath}\`

Source paths:

${entry.sourcePaths.map((sourcePath) => `- \`${sourcePath}\``).join("\n")}
`;
  const readerPrompt = `Use the Flitter LLM pack doc \`${entry.docsPath}\` as the primary reference.

Goal:

- Build or customize ${entry.title.toLowerCase()} honestly.
- Start from the intended abstraction instead of inventing APIs.
- Inspect the listed source paths only after reading the pack doc.
`;

  await fs.mkdir(absoluteOutputDir, { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(absoluteOutputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8"),
    fs.writeFile(path.join(absoluteOutputDir, "README.md"), readme, "utf8"),
    fs.writeFile(path.join(absoluteOutputDir, "starter.ts"), `${entry.starter.trim()}\n`, "utf8"),
    fs.writeFile(path.join(absoluteOutputDir, "reader-prompt.md"), `${readerPrompt}\n`, "utf8"),
  ]);

  console.log(`Scaffolded ${entry.slug} at ${absoluteOutputDir}`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    usage();
    process.exitCode = 1;
    return;
  }

  if (command === "list") {
    for (const entry of registry) {
      console.log(`${entry.type}\t${entry.slug}\t${entry.title}`);
    }
    return;
  }

  if (command === "show") {
    const slug = args[1];
    const entry = slug ? findEntry(slug) : null;
    if (!entry) {
      console.error(`Unknown slug: ${slug ?? "<missing>"}`);
      process.exitCode = 1;
      return;
    }
    console.log(JSON.stringify(entry, null, 2));
    return;
  }

  if (command === "scaffold") {
    const slug = args[1];
    const outputDir = getOption(args, "--output");
    const entry = slug ? findEntry(slug) : null;
    if (!entry) {
      console.error(`Unknown slug: ${slug ?? "<missing>"}`);
      process.exitCode = 1;
      return;
    }
    if (!outputDir) {
      console.error("Missing --output <dir>");
      process.exitCode = 1;
      return;
    }
    await scaffold(entry, outputDir);
    return;
  }

  usage();
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
