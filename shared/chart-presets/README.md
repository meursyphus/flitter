# chart-presets

Concrete chart package for local development and Storybook.

## Intent

- Mirror the shape of chart code that `flitter add` would place in an app.
- Keep `flitter-chart` as the runtime primitive layer.
- Expose concrete styled charts instead of a runtime `style` factory API.

## Naming

- Default AG presets use neutral names such as `bar-chart/` and `line-chart/`.
- Non-default Toast presets use explicit names such as `toast-bar-chart/`.
- Toast-only charts keep their generated folder names internally and are re-exported with neutral component names from [index.ts](./index.ts).

## Layout

- `flitter-ui/chart`: runtime primitive import surface used directly by generated chart code.
- `ag-base/`, `toast-base/`: style-base primitives reused by concrete charts.
- `<chart>/`: default AG concrete charts.
- `toast-<chart>/`: optional Toast concrete charts.

## Source Of Truth

- `packages/chart/registry/templates/` remains the template source for the CLI.
- This package is a generated-like consumer package used by `chart-storybook`.
