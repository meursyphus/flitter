# Scaffold Guide

Generated: 2026-04-07

Use the scaffold tool as a shadcn-like starter materializer for chart authoring.

## Commands

```bash
pnpm llm:kit list
pnpm llm:kit show bar-chart
pnpm llm:kit scaffold bar-chart --output tmp/bar-chart
pnpm llm:kit scaffold scorecard-composite --output tmp/scorecard
```

## What Scaffold Creates

- `README.md`: the chosen chart or pattern brief in local form
- `manifest.json`: machine-readable metadata with source paths and related docs
- `starter.ts`: a quick-start code skeleton
- `reader-prompt.md`: a prompt stub you can hand to a first-read implementation agent

## When To Use It

- When you want a repeatable local starter instead of telling an agent to browse the repo manually
- When you want to compare multiple chart family starts side by side
- When you want to keep the registry, docs, and local working bundle aligned
