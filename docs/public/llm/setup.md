# Setup First

Set up the project before deciding how to generate a chart.

## Workspace facts

- Package manager: `pnpm@10.29.3`
- Monorepo root: `flitter`
- Chart playground: `dev/chart-storybook`
- Docs app: `docs`

## Minimal setup

```bash
pnpm install
```

## Run the chart playground

```bash
pnpm chart-story:dev
```

This starts Storybook for charts from `dev/chart-storybook`.
The local Storybook config uses port `6007`.

## Optional docs app

```bash
pnpm docs:dev
```

Use this when you need to compare Storybook behavior with the public docs examples in `docs/src/app/chart/_data`.

## Quick verification checklist

After setup, confirm these are true:

1. Storybook starts without workspace resolution errors.
2. Chart stories appear from `dev/chart-storybook/src/stories/`.
3. The React renderer works through `@flitterjs/react`.
4. `flitter-ui` primitives are available for direct widget construction.

## Branch rule

If you are given a GitHub link that points to a branch, inspect that branch.
If you are operating locally, check the current branch before reading source:

```bash
git branch --show-current
```

As of 2026-03-06, this working tree was on `renewal-2`, but that should not override a newer explicit branch target.

## What to read first after setup

1. `dev/storybook/src/stories/`
2. `packages/chart/src/shared/`
3. `packages/chart/src/headless/*/types.ts`
4. `dev/chart-storybook/src/stories/`
5. `docs/src/app/chart/_data/`

That order is intentional: core primitives first, reusable chart skeletons second, type truth third, chart references fourth, public docs fifth.
