# Provider And Controller State

Headless charts rely on controllers plus providers rather than local ad hoc state.

Generated: 2026-04-07

## Key Points

- Use ChangeNotifier for chart state and derived layout.
- Use ChangeNotifierProvider to expose controllers to composed widgets.
- Put shared hover, filtering, and visibility state in controllers when multiple parts need it.

## Source Paths

- `packages/core/src/provider/ChangeNotifier.ts`
- `packages/core/src/provider/ChangeNotifierProvider.ts`
- `docs/src/app/advanced/state-management/page.mdx`
