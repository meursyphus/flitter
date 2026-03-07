import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  chartFamilies,
  coreConcepts,
  coreWidgets,
  generatedAt,
  novelEvaluationCases,
  novelPatterns,
  patternRegistryPaths,
  styles,
  widgetCatalogPaths,
} from "./llm-pack-data.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(currentDir, "..");
const publicRoot = path.join(docsRoot, "public");
const publicPackRoot = path.join(publicRoot, "llm");
const sourceMirrorRoot = path.join(docsRoot, "llm", "generated");

function codeBlock(language, value) {
  return `\`\`\`${language}\n${value.trim()}\n\`\`\``;
}

function list(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function titleCase(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function chartDocsPath(chart) {
  return `/llm/chart/${chart.slug}.md`;
}

function patternDocsPath(pattern) {
  return `/llm/patterns/${pattern.slug}.md`;
}

function widgetDocsPath(widget) {
  return `/llm/core/widgets/${widget.slug}.md`;
}

function conceptDocsPath(concept) {
  return `/llm/core/concepts/${concept.slug}.md`;
}

function buildQuickStart(chart) {
  const styleLine =
    chart.supportsStyleArg && chart.supportedStyles.length > 0
      ? `  style: "${chart.supportedStyles[0]}",\n`
      : "";
  const comments =
    chart.surface === "base-wrapper"
      ? "\n// Add config/custom overrides as the request becomes more specific."
      : "";

  return `import Widget from "@flitterjs/react";
import { ${chart.importName} } from "chart-styles";

const widget = ${chart.importName}({
${styleLine}  data: ${chart.dataShape.trim()},
});${comments}

<Widget widget={widget} width="720px" height="420px" />`;
}

function buildSurfaceSummary(chart) {
  if (chart.surface === "preset") {
    if (chart.supportsStyleArg && chart.supportedStyles.length > 0) {
      return `Preset chart. Start with \`chart-styles ${chart.importName}\` and choose from ${chart.supportedStyles.map((style) => `\`${style}\``).join(", ")}.`;
    }
    return `Preset chart. Start with \`chart-styles ${chart.importName}\`. The wrapper already has a default visual direction, so style switching is not the first decision.`;
  }

  return `Base-wrapper chart. Start with \`chart-styles ${chart.importName}\` for structural defaults, but expect to own \`custom\` and \`config\` sooner than with fully themed preset charts.`;
}

function buildChartOverviewMarkdown() {
  const presetCharts = chartFamilies.filter((chart) => chart.surface === "preset");
  const baseCharts = chartFamilies.filter((chart) => chart.surface === "base-wrapper");

  return `# Flitter Chart LLM Pack

Use this pack when an agent needs to implement or customize charts in this repository with as little hidden context as possible.

Generated: ${generatedAt}

## What This Pack Covers

- Full chart family map across preset and base-wrapper charts
- Headless-native chart types with source-of-truth paths
- Novel composition patterns for requests that do not fit a canned chart family
- Core Flitter widget and API knowledge required to leave preset land safely
- A reader-vs-critic evaluation loop with reusable cases

## Build Order

1. Read \`/llm/chart.md\`.
2. Choose the nearest chart brief under \`/llm/chart/<slug>.md\`.
3. If no canonical family fits, move to \`/llm/patterns.md\`.
4. If the plan needs custom composition, read \`/llm/core/concepts.md\` and \`/llm/core/widget-catalog.md\`.
5. Use the scaffold tool to materialize a local starter bundle before coding.

## Surface Types

### Preset Charts

These have stronger ready-made defaults and are the first stop for common chart requests.

${list(
    presetCharts.map(
      (chart) =>
        `\`${chart.slug}\`: ${chart.summary} Styles: ${chart.supportedStyles.length > 0 ? chart.supportedStyles.join(", ") : "default only"}.`,
    ),
  )}

### Base-Wrapper Charts

These still have a \`chart-styles\` entry point, but they behave more like structural wrappers around headless logic than polished theme presets.

${list(
    baseCharts.map(
      (chart) =>
        `\`${chart.slug}\`: ${chart.summary}`,
    ),
  )}

## Styles

${styles
    .map((style) => {
      return [
        `### ${style.title} (\`${style.slug}\`)`,
        "",
        style.summary,
        "",
        `Use when: ${style.useWhen}`,
        "",
        list(style.strengths),
      ].join("\n");
    })
    .join("\n\n")}

## Core Rules

- Start with \`chart-styles\` before using headless controllers directly.
- Treat fully themed presets and base wrappers differently.
- Only use direct Flitter primitives when the request clearly exceeds canonical chart families.
- Do not invent missing style systems or unsupported props.
- Ask clarifying questions only when chart choice, scale semantics, or layout semantics would materially change the implementation.

## Novel Pattern Escalation

Use \`/llm/patterns.md\` when:

- one chart cannot carry the story,
- the prompt explicitly rejects a standard chart look,
- multiple views need linked interaction,
- the result is closer to an application surface than a single chart.

## Core Knowledge Escalation

Use \`/llm/core/concepts.md\` and \`/llm/core/widget-catalog.md\` when:

- you need layout composition beyond a single chart shell,
- you need controller/provider state coordination,
- you need animation or custom paint for bespoke geometry,
- you are building a novel chart composite instead of using one existing family.

## Source Map

- Presets and base wrappers: \`shared/chart-styles\`
- Headless logic: \`packages/chart/src/headless\`
- Chart docs data: \`docs/src/app/chart/_data\`
- Flitter primitives: \`packages/core/src\`
- Generated mirror: \`docs/llm/generated\`
- Public pack output: \`docs/public/llm\`

## Tooling

- \`/llm/chart-registry.json\`: machine-readable registry for charts, patterns, widgets, and concepts
- \`/llm/scaffold-guide.md\`: how to use the shadcn-like starter tool
- \`pnpm llm:kit list\`: inspect installable chart/pattern/widget starters
- \`pnpm llm:kit scaffold <slug> --output tmp/<slug>\`: materialize a starter bundle
- \`pnpm llm:playground:dev\`: open the separate reader-vs-critic validation UI
`;
}

function buildChartMarkdown(chart) {
  return `# ${chart.title}

${chart.summary}

Generated: ${generatedAt}

## Surface

${buildSurfaceSummary(chart)}

## Use When

${list(chart.useWhen)}

## Avoid When

${list(chart.avoidWhen)}

## Quick Start

${codeBlock("ts", buildQuickStart(chart))}

## Data Contract

${codeBlock("ts", chart.dataShape)}

## Ask Before Coding

${list(chart.askBeforeCoding)}

## Implementation Notes

${list(chart.implementationNotes)}

## Override Surface

${list(chart.overrideSurface)}

## Escape Hatch

${chart.escapeHatch}

## Source Paths

${list(chart.sourcePaths.map((sourcePath) => `\`${sourcePath}\``))}
`;
}

function buildPatternsOverviewMarkdown() {
  return `# Novel Chart Patterns

Generated: ${generatedAt}

Use these patterns when the prompt should not be forced into one canonical chart family.

${novelPatterns
    .map((pattern) => {
      return [
        `## ${pattern.title}`,
        "",
        pattern.summary,
        "",
        `Doc: \`${patternDocsPath(pattern)}\``,
        "",
        "Use when:",
        list(pattern.useWhen),
      ].join("\n");
    })
    .join("\n\n")}
`;
}

function buildPatternMarkdown(pattern) {
  return `# ${pattern.title}

${pattern.summary}

Generated: ${generatedAt}

## Use When

${list(pattern.useWhen)}

## Build Path

${list(pattern.buildPath)}

## Related Charts

${pattern.relatedCharts.length > 0 ? list(pattern.relatedCharts.map((chart) => `\`${chart}\``)) : "- No single canonical family applies by default."}

## Source Paths

${list(pattern.sourcePaths.map((sourcePath) => `\`${sourcePath}\``))}
`;
}

function buildCoreConceptsOverviewMarkdown() {
  return `# Core Concepts For Chart Authoring

Generated: ${generatedAt}

Use these when presets stop being enough or when you need to compose novel chart experiences directly with Flitter primitives.

${coreConcepts
    .map((concept) => {
      return [
        `## ${concept.title}`,
        "",
        concept.summary,
        "",
        `Doc: \`${conceptDocsPath(concept)}\``,
      ].join("\n");
    })
    .join("\n\n")}
`;
}

function buildConceptMarkdown(concept) {
  return `# ${concept.title}

${concept.summary}

Generated: ${generatedAt}

## Key Points

${list(concept.points)}

## Source Paths

${list(concept.sourcePaths.map((sourcePath) => `\`${sourcePath}\``))}
`;
}

function buildWidgetCatalogMarkdown() {
  const grouped = coreWidgets.reduce((accumulator, widget) => {
    const key = widget.category;
    accumulator[key] = accumulator[key] ?? [];
    accumulator[key].push(widget);
    return accumulator;
  }, {});

  return `# Widget Catalog For Charting

Generated: ${generatedAt}

This is the chart-relevant Flitter widget list. Use it when leaving preset-only work and composing custom chart shells, overlays, or novel composites.

${Object.entries(grouped)
    .map(([category, widgets]) => {
      return [
        `## ${titleCase(category)}`,
        "",
        list(
          widgets.map(
            (widget) => `\`${widget.slug}\`: ${widget.summary} Doc: \`${widgetDocsPath(widget)}\``,
          ),
        ),
      ].join("\n");
    })
    .join("\n\n")}
`;
}

function buildWidgetMarkdown(widget) {
  return `# ${widget.title}

${widget.summary}

Generated: ${generatedAt}

## Use When

${widget.useWhen}

## Category

\`${widget.category}\`

## Source Paths

${list(widget.sourcePaths.map((sourcePath) => `\`${sourcePath}\``))}
`;
}

function buildEvaluationCases() {
  const chartCases = chartFamilies.map((chart) => {
    return {
      id: chart.slug,
      title: chart.evaluation.title,
      prompt: chart.evaluation.prompt,
      recommendedCharts: [chart.slug],
      pack: ["/llm/chart.md", chartDocsPath(chart)],
      mustAsk: chart.evaluation.mustAsk,
      successCriteria: chart.evaluation.successCriteria,
      criticFocus: chart.evaluation.criticFocus,
    };
  });

  return [...chartCases, ...novelEvaluationCases];
}

function buildEvaluationLoopMarkdown() {
  return `# LLM Evaluation Loop

Generated: ${generatedAt}

Use this loop when tightening the pack for first-read agents.

## Reader Pass

1. Open \`dev/llm-playground\`.
2. Pick one evaluation case.
3. Copy the reader prompt.
4. Run it in a clean agent session that has no extra repo context.
5. Capture the proposed chart family, questions asked, APIs used, and escape-hatch choice.

## Critic Pass

1. Copy the critic prompt for the same case.
2. Provide the reader result and the pack links.
3. Check whether the reader chose the correct family, asked the right questions, and stayed inside supported APIs.
4. Record what the pack failed to make obvious.

## Tightening Rules

- If the reader invents an API, strengthen the source-of-truth path or the quick start.
- If the reader picks the wrong chart family, tighten \`/llm/chart.md\` and the relevant family brief.
- If the reader never asks a crucial question, put that question directly into the family brief.
- If the reader correctly detects a novel request, keep that escape hatch explicit instead of forcing a fake preset.

## Success Condition

A first-read agent should be able to:

- choose a plausible chart family quickly,
- distinguish preset charts from base-wrapper charts,
- ask only the high-value clarifying questions,
- move into patterns and Flitter core knowledge only when the request genuinely requires it.
`;
}

function buildTestingPromptsMarkdown(evaluationCases) {
  return `# Testing Prompts

Generated: ${generatedAt}

Use these prompts to test a first-read agent against the pack.

${evaluationCases
    .map((testCase) => {
      return [
        `## ${testCase.title}`,
        "",
        testCase.prompt,
        "",
        "Pack links:",
        list(testCase.pack.map((item) => `\`${item}\``)),
        "",
        "Success criteria:",
        list(testCase.successCriteria),
      ].join("\n");
    })
    .join("\n\n")}
`;
}

function buildCriticChecklistMarkdown() {
  return `# Critic Checklist

Generated: ${generatedAt}

Use this after the first-read agent has already proposed an implementation.

## Chart Choice

- Did the agent choose the correct chart family, or force the prompt into the nearest familiar chart?
- Did it distinguish preset charts from base-wrapper charts?
- Did it explain the tradeoff when two families were both plausible?
- Did it correctly detect when the request should leave canonical chart families entirely?

## API Honesty

- Did it stay inside \`chart-styles\` before escalating?
- Did it invent props, styles, or helper APIs that do not exist?
- Did it point to the right source paths for the chosen escape hatch?

## Core Knowledge

- Did it pull in Flitter core concepts only when necessary?
- Did it identify the right widgets or providers for custom composition?
- Did it misuse direct primitives where a preset or base wrapper would have been cleaner?

## Missing Questions

- Did it ask about scale semantics when those affect interpretation?
- Did it ask about orientation, stacking mode, or size encoding when those materially change the chart?
- Did it avoid low-value questions that the pack already answered?

## Documentation Feedback

- Which ambiguity in the pack caused the failure?
- Which doc needs tightening: chart brief, pattern brief, widget doc, or concept doc?
- What one sentence would have prevented the reader from making the same mistake again?
`;
}

function buildScaffoldGuideMarkdown() {
  return `# Scaffold Guide

Generated: ${generatedAt}

Use the scaffold tool as a shadcn-like starter materializer for chart authoring.

## Commands

\`\`\`bash
pnpm llm:kit list
pnpm llm:kit show bar-chart
pnpm llm:kit scaffold bar-chart --output tmp/bar-chart
pnpm llm:kit scaffold scorecard-composite --output tmp/scorecard
\`\`\`

## What Scaffold Creates

- \`README.md\`: the chosen chart or pattern brief in local form
- \`manifest.json\`: machine-readable metadata with source paths and related docs
- \`starter.ts\`: a quick-start code skeleton
- \`reader-prompt.md\`: a prompt stub you can hand to a first-read implementation agent

## When To Use It

- When you want a repeatable local starter instead of telling an agent to browse the repo manually
- When you want to compare multiple chart family starts side by side
- When you want to keep the registry, docs, and local working bundle aligned
`;
}

function buildRegistry(evaluationCases) {
  return {
    version: 2,
    generatedAt,
    entrypoints: {
      guide: "/llm/chart.md",
      registry: "/llm/chart-registry.json",
      patterns: patternRegistryPaths.markdown,
      patternsRegistry: patternRegistryPaths.json,
      widgetCatalog: widgetCatalogPaths.markdown,
      widgetCatalogJson: widgetCatalogPaths.json,
      coreConcepts: "/llm/core/concepts.md",
      scaffoldGuide: "/llm/scaffold-guide.md",
      evaluationLoop: "/llm/evaluation-loop.md",
      testingPrompts: "/llm/testing-prompts.md",
      criticChecklist: "/llm/critic-checklist.md",
      evaluationCases: "/llm/evaluation-cases.json",
    },
    styles,
    charts: chartFamilies.map((chart) => ({
      ...chart,
      docsPath: chartDocsPath(chart),
    })),
    patterns: novelPatterns.map((pattern) => ({
      ...pattern,
      docsPath: patternDocsPath(pattern),
    })),
    widgets: coreWidgets.map((widget) => ({
      ...widget,
      docsPath: widgetDocsPath(widget),
    })),
    coreConcepts: coreConcepts.map((concept) => ({
      ...concept,
      docsPath: conceptDocsPath(concept),
    })),
    evaluationCases,
    scaffoldCommands: {
      list: "pnpm llm:kit list",
      show: "pnpm llm:kit show <slug>",
      scaffold: "pnpm llm:kit scaffold <slug> --output tmp/<slug>",
    },
  };
}

function buildLlmsTxt(registry) {
  return `# Flitter chart generation pack for LLMs

Generated: ${generatedAt}

Start here:

- ${registry.entrypoints.guide}

Registries:

- ${registry.entrypoints.registry}
- ${registry.entrypoints.patternsRegistry}
- ${registry.entrypoints.widgetCatalogJson}

Core docs:

- ${registry.entrypoints.patterns}
- ${registry.entrypoints.coreConcepts}
- ${registry.entrypoints.widgetCatalog}
- ${registry.entrypoints.scaffoldGuide}

Chart family briefs:

${chartFamilies.map((chart) => `- ${chartDocsPath(chart)}`).join("\n")}

Pattern briefs:

${novelPatterns.map((pattern) => `- ${patternDocsPath(pattern)}`).join("\n")}

Validation assets:

- ${registry.entrypoints.evaluationLoop}
- ${registry.entrypoints.testingPrompts}
- ${registry.entrypoints.criticChecklist}
- ${registry.entrypoints.evaluationCases}

Local validation UI:

- dev/llm-playground
- Start with: \`pnpm llm:playground:dev\`

Starter tool:

- \`pnpm llm:kit list\`
- \`pnpm llm:kit scaffold <slug> --output tmp/<slug>\`

Rules:

- Prefer \`chart-styles\` first.
- Distinguish preset charts from base-wrapper charts.
- Use patterns when one chart family is the wrong abstraction.
- Use Flitter core knowledge only when you need custom composition or novel charts.
`;
}

async function writeOutput(relativePath, content) {
  for (const root of [publicPackRoot, sourceMirrorRoot]) {
    const filePath = path.join(root, relativePath);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, "utf8");
  }
}

async function buildPack() {
  const evaluationCases = buildEvaluationCases();
  const registry = buildRegistry(evaluationCases);

  await writeOutput("chart.md", buildChartOverviewMarkdown());
  await writeOutput("patterns.md", buildPatternsOverviewMarkdown());
  await writeOutput("core/concepts.md", buildCoreConceptsOverviewMarkdown());
  await writeOutput("core/widget-catalog.md", buildWidgetCatalogMarkdown());
  await writeOutput("scaffold-guide.md", buildScaffoldGuideMarkdown());
  await writeOutput("evaluation-loop.md", buildEvaluationLoopMarkdown());
  await writeOutput("testing-prompts.md", buildTestingPromptsMarkdown(evaluationCases));
  await writeOutput("critic-checklist.md", buildCriticChecklistMarkdown());
  await writeOutput("chart-registry.json", `${JSON.stringify(registry, null, 2)}\n`);
  await writeOutput("pattern-registry.json", `${JSON.stringify(novelPatterns.map((pattern) => ({ ...pattern, docsPath: patternDocsPath(pattern) })), null, 2)}\n`);
  await writeOutput("core/widget-catalog.json", `${JSON.stringify(coreWidgets.map((widget) => ({ ...widget, docsPath: widgetDocsPath(widget) })), null, 2)}\n`);
  await writeOutput("core/core-concepts.json", `${JSON.stringify(coreConcepts.map((concept) => ({ ...concept, docsPath: conceptDocsPath(concept) })), null, 2)}\n`);
  await writeOutput("evaluation-cases.json", `${JSON.stringify(evaluationCases, null, 2)}\n`);

  for (const chart of chartFamilies) {
    await writeOutput(path.join("chart", `${chart.slug}.md`), buildChartMarkdown(chart));
  }

  for (const pattern of novelPatterns) {
    await writeOutput(path.join("patterns", `${pattern.slug}.md`), buildPatternMarkdown(pattern));
  }

  for (const widget of coreWidgets) {
    await writeOutput(path.join("core", "widgets", `${widget.slug}.md`), buildWidgetMarkdown(widget));
  }

  for (const concept of coreConcepts) {
    await writeOutput(path.join("core", "concepts", `${concept.slug}.md`), buildConceptMarkdown(concept));
  }

  const llmsTxt = `${buildLlmsTxt(registry)}\n`;
  await fs.mkdir(publicRoot, { recursive: true });
  await fs.writeFile(path.join(publicRoot, "llms.txt"), llmsTxt, "utf8");
  await fs.mkdir(sourceMirrorRoot, { recursive: true });
  await fs.writeFile(path.join(sourceMirrorRoot, "llms.txt"), llmsTxt, "utf8");
}

buildPack().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
