# LLM Pack Notes

`docs/llm` is the source area for chart-facing LLM documentation work.

Current layout:

- Hand-written reference notes remain in this folder.
- Generated pack output is mirrored to `docs/llm/generated/`.
- Publicly fetchable assets are emitted to `docs/public/llm/`.
- Metadata source of truth now lives in `docs/scripts/llm-pack-data.mjs`.

To rebuild the pack:

```bash
pnpm --dir docs llm:build
```

The generator currently lives at `docs/scripts/build-llm-pack.mjs`.
