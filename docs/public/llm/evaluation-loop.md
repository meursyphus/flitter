# Evaluation Loop

This file is internal.

Use this file to improve the chart-generation docs over repeated test cycles.

## Goal

The goal is not just to write one good `llms.txt`.
The goal is to keep tightening the loop until natural-language prompts reliably turn into valid Flitter chart code.

## Loop

1. Pick a prompt from `testing-prompts.md`.
2. Give the agent `llms.txt` plus the prompt.
3. Generate or edit chart code in the repo.
4. Compare the result against current repo conventions and `Charts/LLMEvaluation` in Storybook.
5. Categorize the failure.
6. Patch the most specific doc that should have prevented the failure.
7. Re-run the same prompt.
8. Re-run neighboring prompts from the same failure family.

For each prompt, define both:

- pass conditions
- reject conditions

Without reject conditions, a prompt can look acceptable while still allowing the wrong chart family.

## Failure taxonomy

### Chart choice failure

Examples:

- chose `LineChart` when the prompt required category comparison
- chose `PieChart` for a two-axis matrix

Patch target:

- `chart-selection.md`
- chart-specific leaf docs

### Style failure

Examples:

- used `toast` for an explicitly muted business dashboard
- used `ag` when the user asked for a softer default

Patch target:

- `chart-selection.md`
- `authoring-rules.md`

### Data shape failure

Examples:

- mismatched `labels` and `values`
- forgot `value` for bubble points
- transposed `HeatmapChart.values`

Patch target:

- chart-specific leaf docs
- `authoring-rules.md`

### Repo integration failure

Examples:

- wrong package import
- wrong `Widget` import style
- wrote code against stale docs instead of current Storybook patterns

Patch target:

- `setup.md`
- `repo-map.md`
- `authoring-rules.md`

### Unsupported API invention

Examples:

- invented dual-axis config
- invented combo-chart config
- invented unsupported style-only props

Patch target:

- `authoring-rules.md`
- the relevant chart leaf doc

## Golden suite

The first complex golden suite lives in Storybook under:

- `Charts/LLMEvaluation`

The machine-readable prompt metadata lives in:

- `llm/evaluation-cases.json`

These stories are intentionally more difficult than the basic examples.
Use them as regression targets after doc edits.

## Patch discipline

- Patch the narrowest doc that can prevent the same mistake next time.
- Do not stuff every lesson into `llms.txt`.
- Keep `llms.txt` as the routing layer, and put details in leaf docs.

## What counts as improvement

Improvement is real only if:

- the same prompt now succeeds
- nearby prompts also improve
- the docs become more precise without becoming noisy

If a patch helps only one prompt and makes the general rules worse, revert the idea and write a narrower rule.

## Validation artifact

Keep a lightweight running report in:

- `llm/validation-report.md`

That report should record which prompts are:

- strong
- weak
- ambiguous

and why.
