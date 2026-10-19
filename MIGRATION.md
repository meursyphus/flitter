# Flitter 1.0 package migration

The rendering engine is now `flitterjs@1.0.0`. Feature packages and framework
adapters are independently versioned at `0.1.0` for this release.

| Previous package/import | Replacement |
| --- | --- |
| `flitter-ui`, `flitter-core` | `flitterjs` |
| `flitter-ui/chart`, `flitter-chart` | `@flitterjs/chart` |
| `flitter-ui/diagram`, `flitter-diagram`, `flitter-diagram/engine` | `@flitterjs/diagram` |
| `@flitterjs/react` | `@flitterjs/adapter-react` |
| `@flitterjs/svelte` | `@flitterjs/adapter-svelte` |
| `npx flitter-ui` | `npx @flitterjs/cli@latest` |

Install only the packages your application uses:

```sh
npm install flitterjs @flitterjs/adapter-react @flitterjs/chart
# Svelte applications use @flitterjs/adapter-svelte instead of adapter-react.
# Diagram applications also install @flitterjs/diagram.
```

```tsx
import { Container, Text } from 'flitterjs';
import Widget from '@flitterjs/adapter-react';
import { BarChart } from '@flitterjs/chart';
import { FlowDiagram } from '@flitterjs/diagram';
```

The feature packages expose headless APIs. Styled charts and diagrams remain
editable source installed by the CLI. Existing copied source must also update
its imports; preserve local customizations when migrating it.

```sh
npx @flitterjs/cli@latest init
npx @flitterjs/cli@latest add bar-chart --style ag
npx @flitterjs/cli@latest add flow-diagram
```

`init` writes configuration. `add` installs the engine and the relevant feature
package unless `--skip-install` is supplied. Install the appropriate framework
adapter yourself. `--overwrite` replaces copied source, so use it only after
preserving your edits.

The engine has no dependencies on charts, diagrams, React, Svelte, or linkedom.
Feature packages and adapters declare `flitterjs ^1.0.0` as a peer dependency,
so widgets and application code share the same engine. Svelte's server-rendering
dependency belongs only to the Svelte adapter. The CLI is an independent build-time
tool and is not needed to run an application.

## Release verification

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm --dir packages/core build
pnpm --dir packages/chart build
pnpm --dir packages/diagram build
pnpm --dir integrations/react build
pnpm --dir integrations/svelte build
pnpm --dir packages/flitter test:install
node scripts/check-release-install.mjs
pnpm --dir docs llm:build
node docs/scripts/gen-diagram-api.mjs --check
pnpm --dir docs build
```

The tarball check installs all six publishable packages in an isolated project,
runs the installed CLI, checks copied templates and React/Svelte consumer types,
loads the public runtime exports, compiles the Svelte component, and checks that
no feature or adapter dependency leaks into the engine.

Publish the verified engine tarball first, followed by feature packages, adapters,
and the CLI. Use the npm `latest` dist-tag. Future versions are independent;
only the supported engine peer range must remain compatible.
