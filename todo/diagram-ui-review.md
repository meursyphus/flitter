# Diagram UI review (Opus, 2026-10-18, on `latest` 6b3eb66e)

Headless Chromium, 1440×900 dark and light, iPhone 13 touch, SVG and Canvas, DPR 1 and 2.
`check-diagram-gallery.mjs` passes 46/46. Most cells only assert "renders", so everything below came from screenshots and scripted drags/clicks.
Use this list as the regression check for the §9 restructure: each item should be fixed or explicitly left with a reason.

## Engine / core

- [x] **Pill radius artifacts** (`BorderRadius.circular(r)` with r > height/2 drew crossing arcs: the "Healthy" badges in deployment-canvas looked like bow ties, SVG and Canvas). Fixed in core `Path.addRRect` (Flutter `scaleRadii`), branch `fix/docs-landing`, test `dev/performance/src/rrect-radii.test.ts`.
- [ ] **Word gaps in text** (core, not diagram): `getTextWidth` ceils every word segment, so each word gap gains up to 2px ("Monthly visitors  by  city"). Left unchanged in Round 2: packages/core is explicitly excluded; separate task, issue #122.

## Gallery examples

- [x] deployment-canvas: the "Service details" side panel covers the right edge of the Production group at the initial fit. Fit with padding that leaves room for the panel, or dock the panel outside the stage. Round 2: inspector docked in a reserved 229px column above 700px; hidden on narrower stages.
- [x] deployment-canvas: after deleting the selected node, the side panel still shows it with a working "Redeploy" button. Clear the panel on `on.delete` / selection change. Round 2: selectionChange/delete clear the inspector, and Redeploy checks that its node still exists.
- [x] Context menu (pane right-click): no radius, no shadow, flat. Match the controls panel and the node font. Round 2: configurable radius, item radius, shadow colour/blur/offset and inherited node font.
- [x] scenario-router / state-machine / knowledge-graph: edge labels overlap other edges and each other (SUBMIT/RETRY stack on the draft→authorizing edge; "Fallback" path crosses "2 · status = paid"; node captions under circles cross edges). Round 2: wider router branch spacing and per-edge anchors; separate state transition anchors; backed knowledge captions.
- [x] automation-workflow: nodes are 205×100 but content uses the top third, so they read as empty boxes. Size to content or vertically centre. Round 2: 205×82 cards, vertically centred content, matching sizes for added/inserted actions.
- [x] dataflow-graph: minimap is a flat grey box with no visible viewport rectangle or node contrast in dark mode. Round 2: four-strip outside mask, contrasting nodes and a separate 2px viewport outline in both themes.
- [x] Text is 6–8px at the initial fit in most examples (linear-steps, org-chart, state-machine, dataflow-graph, pipeline-run). Raise the base font sizes or cap `fitView.minZoom` so labels stay ≥ 10px on a 1440 screen. Round 2: per-example initial zoom floors of 0.8–0.9, 13px text floor and 13px default edge labels; desktop/mobile unit coverage.
- [x] Mobile (390px): the stage is tall and the fit zoom makes nodes unreadable (automation-workflow ≈ 4px text); the bottom hint line overflows the stage width. Use a shorter stage on mobile and wrap/hide the hint. Round 2: 320px gallery stage, hints hidden below 500px or constrained in cards; readable zoom floors preserve detail while panning.

## Docs pages

- [x] /diagram hero: the live example is fit into a wide box with large empty margins; nodes are tiny. Crop or zoom to the interesting part. Round 2: 380px desktop/300px mobile stage focused on the qualification branch at zoom 1.
- [ ] Gallery thumbnails (static SVGs): toolbars are clipped at the top edge (deployment-canvas "Show references…", linear-steps header). Regenerate with `DIAGRAM_DOCS_THUMBNAILS=1` after the example fixes. Left for Opus: browser/server execution is unavailable in this sandbox; no thumbnails were hand-edited.

## Round 2 contract and verification

- [x] Empty custom slots return `SizedBox.shrink()`; removed the stray data blank line. Docs explicitly enable `strictNullChecks` and include a type-check probe that fails if null becomes accepted.
- [x] API staleness check and preset sync rerun after style changes. Generated presets are never edited directly.
- [ ] Browser walkthrough and thumbnail capture remain for Opus. `check-diagram-gallery.mjs` now checks desktop/mobile text size, deletion, transition anchors, hero framing and minimap contrast; it was not executed here.

## Round 3 initial framing

- [x] Knowledge graph: removed the initial/reflow zoom floor; the complete graph fits with margin. Captions use 15px base type and remain at least 10px in the desktop unit fixture.
- [x] Linear steps: initial layout and tidy anchor the trigger at y=112 below the header. The configuration panel hides on narrow stages; later rows remain accessible by panning.
- [x] State machine: hint and selected-state status share a vertical footer, so wrapped text cannot overlap. Pipeline hints also reserve the log-panel lane.
- [x] Gallery containment: initial fits across the other examples no longer enforce zoom floors that crop nodes. Fitting takes priority over 10px text when a narrow stage cannot satisfy both.
- [x] Browser assertions inspect full render-layout node and keyed panel bounds for SVG/Canvas at desktop/mobile sizes. All nodes require an 8px stage margin; only the tall linear flow may show just its trigger, fully below the header. Hint/status rectangles must not intersect.
- [ ] Browser execution remains for Opus; this sandbox runs the geometry/unit/type checks, not the gallery server/browser walkthrough.

## What worked

Drag (edges follow), undo/redo after drag and after delete, Backspace delete, context menu opening, SVG/Canvas parity, light/dark switching, no page-level horizontal overflow on mobile, no console errors on any page.
