# diagram-presets

Generated output of `flitter add flow-diagram` for every registered diagram
style, used by Storybook and type checks to prove the copied template compiles
and renders like the in-repo source. Never edit by hand:

```bash
pnpm --dir shared/diagram-presets run sync
pnpm --dir shared/diagram-presets run typecheck
```
