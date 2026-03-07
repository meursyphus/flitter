# LLM Authoring System

This document explains the chart authoring pack that was added for first-read agents, critic agents, and later human review.

## Goal

The system is meant to support:

- preset chart authoring from `chart-styles`
- base-wrapper chart authoring on top of headless chart controllers
- novel composite chart decisions when no canonical family fits
- enough Flitter core knowledge to leave preset land safely
- a repeatable reader-vs-critic validation loop

## Source Of Truth

The source metadata lives in:

- `docs/scripts/llm-pack-data.mjs`

That file defines:

- chart families
- novel composition patterns
- core concepts
- widget catalog
- evaluation cases

## Generators And Tools

### Pack generator

- `docs/scripts/build-llm-pack.mjs`
- command: `pnpm llm:build`

What it writes:

- `docs/public/llm/*`
- `docs/public/llms.txt`
- mirror copies in `docs/llm/generated/*`

Generated outputs include:

- chart briefs under `docs/public/llm/chart/`
- novel pattern briefs under `docs/public/llm/patterns/`
- core concept docs under `docs/public/llm/core/concepts/`
- widget docs under `docs/public/llm/core/widgets/`
- machine-readable registries
- evaluation loop docs and cases

### Shadcn-like starter tool

- `docs/scripts/llm-kit.mjs`
- command: `pnpm llm:kit list`
- command: `pnpm llm:kit show <slug>`
- command: `pnpm llm:kit scaffold <slug> --output tmp/<slug>`

What scaffold writes:

- `README.md`
- `manifest.json`
- `starter.ts`
- `reader-prompt.md`

The idea is to give an agent a local starter bundle instead of forcing it to browse the repo from scratch.

## Validation UI

Validation is intentionally separate from `chart-storybook`.

- `dev/llm-playground/server.mjs`
- `dev/llm-playground/app.js`
- command: `pnpm llm:playground:dev`

The playground reads the generated pack and shows:

- evaluation cases
- reader prompt
- critic prompt
- chart registry
- novel patterns
- Flitter core concepts
- widget catalog
- scaffold commands

## Abstraction Levels

### Level 1: Preset chart

Use `chart-styles` with themed presets.

Examples:

- `bar-chart`
- `line-chart`
- `scatter-chart`

### Level 2: Base-wrapper chart

Use `chart-styles` as a structural wrapper over headless logic, but expect to own `custom` and `config` earlier.

Examples:

- `sankey-chart`
- `gantt-chart`
- `treemap-chart`
- `waterfall-chart`

### Level 3: Novel composition

Use pattern docs and Flitter core primitives when the prompt does not map honestly to one canonical family.

Examples:

- `scorecard-composite`
- `multi-chart-dashboard`
- `novel-data-composite`

## Feedback Loop

The intended loop is:

1. Select a case in `dev/llm-playground`
2. Copy the reader prompt
3. Run a clean first-read agent with only the pack docs
4. Capture its output
5. Copy the critic prompt
6. Review the reader result against the pack
7. Tighten `docs/scripts/llm-pack-data.mjs`
8. Re-run `pnpm llm:build`
9. Re-check in the playground

## Where To Edit

If the reader chooses the wrong chart family:

- edit chart metadata in `docs/scripts/llm-pack-data.mjs`

If the reader needs a new composite path:

- add or refine a novel pattern in `docs/scripts/llm-pack-data.mjs`

If the reader fails after leaving presets:

- strengthen the core concepts or widget catalog in `docs/scripts/llm-pack-data.mjs`

If the local starter is weak:

- edit `docs/scripts/llm-kit.mjs`

If the browser review surface is weak:

- edit `dev/llm-playground/app.js`
- edit `dev/llm-playground/styles.css`

## Review Checklist

When reviewing later, check these first:

- `docs/public/llm/chart-registry.json`
- `docs/public/llm/chart.md`
- `docs/public/llm/patterns.md`
- `docs/public/llm/core/concepts.md`
- `docs/public/llm/core/widget-catalog.md`
- `docs/public/llm/evaluation-cases.json`
- `dev/llm-playground`

## Current Verification

The following were verified during implementation:

- pack generation ran successfully
- registry and generated docs were written to public and mirrored source folders
- CLI list and scaffold commands ran successfully
- separate browser-side validation UI rendered in headless Chromium
- case switching worked
- prompt boxes rendered
- generated docs were fetchable from the browser
- no browser console errors or runtime page errors were observed during the smoke check

## Limit

This system improves first-read authoring, but it still does not magically prove that every future agent will implement every prompt correctly. The system is designed so that failures can be surfaced, criticized, and folded back into the metadata and generated pack quickly.
