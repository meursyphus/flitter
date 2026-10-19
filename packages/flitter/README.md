# @flitterjs/cli

Install editable chart and diagram templates.

```sh
npm install flitterjs @flitterjs/adapter-react
npx @flitterjs/cli@latest init
npx @flitterjs/cli@latest add bar-chart --style ag
npx @flitterjs/cli@latest add flow-diagram
```

For Svelte use `@flitterjs/adapter-svelte`. `init` creates `flitter.json`.
`add` installs `flitterjs` and the relevant `@flitterjs/chart` or
`@flitterjs/diagram` runtime, then copies editable styling source.
The CLI is not a runtime dependency. `--skip-install` skips dependency installation.

See [documentation](https://ui.flitter.dev) and [migration notes](../../MIGRATION.md).
