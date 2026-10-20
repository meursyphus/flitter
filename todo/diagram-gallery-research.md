# Diagram gallery: application research and implementation brief

Research date: 2026-10-20. Scope: Flitter Diagram overview, gallery, and ten local application recipes.

## Decision

Make the gallery a collection of usable product surfaces. Minimal graphs and isolated slot demonstrations remain learning material in Quick Start and the interaction reference. A gallery entry must have a recognisable task, distinct node content, meaningful actions, readable initial framing, and a complete source example.

The current engine already permits replacement of the node, inline handles, edge, label, controls, minimap, context menu, and complete layout. No new widget registry or interaction API is needed for this pass. Product-specific behavior is composed with validation, events, controller commands, and Flitter stateful widgets.

## Evidence and limits

The EasyRD demo and dbdiagram anonymous editor were opened directly in the browser. The existing Flitter overview and gallery were captured before changes. Railway's official documentation was opened and its project-canvas screenshot expanded. React Flow's showcase was inspected visually and its listed products reviewed. Dify's public product page was inspected, while workflow behavior for Dify, n8n, GitHub Actions, and ComfyUI was researched from their official documentation. No authenticated service workspace was accessed. Published product screenshots and docs are reference evidence, not proof that every service interaction was tested.

### Observed screens

1. **Flitter overview — weak proof of customization.** The hero showed two largely empty nodes, despite promising ownership of every widget. The split hero made even this small example feel detached from any real task.
2. **Flitter gallery — weak hierarchy.** Four elementary examples led the list. Repeated “Default” badges and generic descriptions obscured what differed between applications. Thumbnails shrank the entire graph into small cards.
3. **EasyRD — clear code/diagram pairing.** A DBML editor occupies the left column. Tables show column names and types in aligned rows; relation lines terminate at the relevant rows. The shared commerce domain makes the screen immediately interpretable. [Live demo](https://easyrd.dev/workspace/demo)
4. **dbdiagram — field-level data and persistent tools.** The anonymous editor pairs code and the schema canvas, with field metadata, relation cardinality, and persistent zoom/layout controls. Its announcement overlay was dismissed before capturing the editor. [Editor](https://dbdiagram.io/d), [editing documentation](https://docs.dbdiagram.io/basic-editing-experience)
5. **Railway — service-first canvas.** The published project screenshot uses compact service cards, an environment context, and canvas-level actions. Official docs describe selection opening service configuration. [Projects](https://docs.railway.com/projects)
6. **React Flow — applications demonstrate breadth.** The showcase includes Supabase and ChartDB schema tools; Attio, OneSignal, and Retool workflow builders; Dify AI workflows; and Stripe documentation flowcharts. These are examples of React Flow adoption, not Flitter adoption. [Showcase](https://reactflow.dev/showcase)

Screenshot captures are kept with this chat's local visual artifacts, not shipped as third-party assets in the website. The gallery uses fresh snapshots of Flitter's own running examples.

## Patterns translated into Flitter

| Application | Primary reference | Useful UI/UX pattern | Flitter demonstration |
| --- | --- | --- | --- |
| Database schema studio | EasyRD, dbdiagram, Supabase | Row-level relations, table explorer, persistent controls | `custom.node` composes table rows and inline handle widgets; `custom.layout` composes the complete workspace. Search and selection remain live. |
| Lead qualification workflow | n8n, Dify, Attio | Trigger/action/condition cards, execution data, inspector, insertion affordance | Replace action cards and edge labels. Run a deterministic local simulation, inspect a step, insert actions, and undo. |
| Service architecture | Railway | Environment groups, service status, dependency references, inspector | Nested groups and custom service cards. Selection changes the inspector; simulated redeploy updates a service. |
| CI run explorer | GitHub Actions | Jobs grouped by stage, dependency tracing, selected-job logs | Viewer interactions with custom status widgets, a log drawer, and simulated progression. |
| Image processing studio | ComfyUI | Typed ports and colored connections, bypass, reroute, compact node bodies | Custom ports/wires/toolbars, connection validation, and local graph editing. No image inference is performed. |
| Checkout state editor | Stately | Compound states and explicit transitions | Custom state frames, transition handles, child creation, and undo. This is a statechart editor, not a state-machine runtime. |

Supporting primary sources:

- [n8n execution history and loading an execution into the canvas](https://docs.n8n.io/workflows/executions/all-executions/)
- [Dify Workflow Studio: branching, node testing, and traces](https://www.dify.ai/workflows)
- [GitHub Actions workflow monitoring](https://docs.github.com/en/actions/how-tos/monitor-workflows)
- [ComfyUI node types, connections, and bypass](https://docs.comfy.org/basic-concepts/nodes)
- [Stately visual editor](https://stately.ai/docs/editor) — URL retained as a product reference; automated page retrieval failed during research. Its authenticated editor was not audited.
- [React Flow custom nodes](https://reactflow.dev/learn/customization/custom-nodes)

## Applied design rules

- Keep the site's established typography, dark/light themes, and diagram accent.
- Give the overview its own purpose: demonstrate replaceable widgets on one persistent graph. Keep application discovery in the gallery.
- Curate ten task-oriented examples, with the database first. Group by People, Processes, Data, and Connections.
- Gallery cards contain the rendered preview and a large title. Categories remain only as functional filters; slot names and implementation details live in the source disclosure.
- Let the interaction demonstrate the task. Supporting instructions and customization details are available inside the source disclosure.
- Give the canvas, controls, and inspector dedicated space; avoid floating panels covering nodes.
- Use realistic local sample data. Label simulation once, without pretending to call external services.
- Keep exact running source available, collapsed initially so the application stays primary.
- Generate thumbnails from the final SVG surface in both themes. Preserve the full composition instead of cropping it.
- Treat references as inspiration and attribution; do not reuse service branding or claim a full clone.

## Customization boundary

`config` changes style tokens. `custom` returns replacement widgets. `getHandles`, `getEdgePath`, `nodeOptions`, and connection validation control domain geometry/rules. Events and controller methods implement application actions. State belongs in Flitter `StatefulWidget` / `State`, with lifecycle cleanup for timers/controllers.

The engine owns core dragging, selection, panning, connection gestures, and history. Arbitrarily replacing those low-level gesture implementations is an engine change; these examples do not claim that `custom.node` replaces the gesture state machine. This separation is worth explaining in docs rather than adding another API pre-emptively.

## Acceptance

- All ten entries represent practical applications and have live interactions, source, and references.
- Overview replaces node, edge, and control widgets without resetting graph positions, connections, selection, or edit history.
- Both SVG and Canvas renderers work; both themes have fresh thumbnails.
- Schema search/selection, workflow run/selection, deployment selection/redeploy, and CI logs/run are exercised.
- Small-screen framing is checked without promoting overflow or unreadably dense panels.
- Type-check and production docs build pass; any limits are recorded with the handoff.

## Initial six-application verification

- Production docs build: 155 static pages, including all six application routes.
- TypeScript validation passes as part of the production build.
- Six SVG previews and six Canvas previews inspected; all twelve light/dark SVG thumbnails regenerated from the live examples.
- Exercised schema search and selection; workflow run (12 inputs split into 9/3) and selected-step output; service selection and simulated redeploy; CI log selection and completed run; processor bypass; nested-state creation and undo.
- Overview switches between schema, workflow, and service applications. Gallery filtering returns the correct application cards.
- Source panels for all six examples match their example files.
- 390px iframe viewport checks: overview, gallery, and all six detail routes report document width 390px with no horizontal overflow. Diagrams retain pan/zoom for inspecting dense graphs on small screens. This verifies responsive layout, not real-device touch behavior.
- No browser console errors during the final application checks.
- The repository Playwright suite was updated for the new categories, source disclosure, and stage dimensions; this pass used the in-app browser for interaction checks rather than running that suite.

## Follow-up: reduce text and demonstrate interaction customization

User direction: remove nonessential small text and eyebrows across docs discovery surfaces. Cards now show only a preview and title. Home, chart/diagram overviews, galleries, and detail pages remove secondary marketing descriptions, repeated badges, decorative metadata, and always-open code. Installation and source remain available through functional links/disclosures; API reference content remains intact.

The workflow now starts in Review: Approve or Nurture selects an execution path, highlights its edges, and dims unvisited nodes. Edit enables dragging, connection/drop insertion, and undo. Review traverses the actual edited graph, including inserted steps; simulated execution metadata does not consume graph-edit history.

Switching modes exposed a core bug: DragBackend retained callbacks from the detector's original widget. Gesture dispatch now resolves the retained render object's current callbacks. Two regression tests fail before the fix and pass afterward. Browser verification confirms that Edit dragging changes relative node positions, Undo restores them, and Review preserves relative positions.

Validation: 283 unit tests across 32 files pass; core TypeScript validation passes; production docs build exports 155 pages. The in-app browser verifies review outcomes and mode switching.

Renderer selection (SVG/Canvas) is grouped on the left; Reset is a separate action on the right. Browser checks confirm Reset restores the example while retaining the selected renderer.

## Follow-up: different diagram languages

Four structurally different applications were added to the existing database and workflow examples:

- Family tree: circular people, explicit couple junctions, sibling branches, child creation, and folding a household subtree while preserving both parents. New children avoid occupied positions in their generation.
- Genetic pedigree: square/circle/diamond symbols, partner and sibling lines, click-to-mark fictional traits or deceased status, and undo. Basic notation was checked against the University of Iowa's [pedigree reference](https://humangenetics.medicine.uiowa.edu/resources/how-draw-pedigree). This is a visual editor with fictional data, not an inheritance calculator.
- Returns flowchart: start/end capsules, process rectangles, a decision diamond, editable labels, shape insertion, and undo. Shape meanings follow [Lucid's notation reference](https://lucid.co/diagram/flowchart/symbols).
- Cable routing: colored edges take priority over nodes. Bend and midpoint grips, visible endpoint rings, reconnect validation, elbow/curve paths, and undo are all interactive. The central rack is a visual obstacle, not an automatic routing solver.

The gallery cards remain preview + title only; categories are functional filters. Guidance and references remain inside the source disclosure. There are now ten gallery entries.

Validation: 303 unit tests across 32 files; 159-page docs build. In-app browser checks exercised child creation/folding, trait/deceased marking, flowchart label editing and decision insertion, bend dragging, midpoint insertion, undo, and video cable reconnection to the Encoder input. All four new applications were inspected in SVG and Canvas; light/dark thumbnails are generated from the real rendered stages.

## Follow-up: overview philosophy and database-first ordering

The database schema studio is the first gallery entry. The overview no longer repeats the gallery cards or application switcher. It demonstrates one graph with replaceable `custom.node`, `custom.edge`, and `custom.controls` widgets: cards, circles, and sparklines; straight, curved, and animated connections; horizontal and vertical control compositions. Geometry strategies adapt connection endpoints and paths to the chosen widgets.

A stable Flitter state and controller retain moved nodes, added connections, selection, and undo history while the replacement widgets change. SVG/Canvas controls remain separate from Reset. Source ownership is expressed by the CLI installation command; the gallery has one navigation link. Essential copy stays large and short, and the builder mapping is collapsed under Code.

Unit verification: 306 tests across 33 files pass, including new assertions for persistent graph edits/history and changed connection geometry.

Final overview verification: production build exports 159 pages. Browser checks confirm exact relative node positions survive all widget choices, animated dashes advance, the custom rail still zooms/fits, and Reset restores default choices while retaining the renderer. SVG and Canvas render, both themes are inspected, 390px overview/gallery have no horizontal overflow, and the first gallery card is the database. No browser console errors were recorded.
