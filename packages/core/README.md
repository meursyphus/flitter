# flitter-core

Internal core module for the Flitter framework.

### Virtualized lists and slivers

`ListView` builds, lays out, and paints only the viewport and its cache window.
It requires bounded width and height, for example inside a `SizedBox` or an
`Expanded` child of a bounded `Column`.

```typescript
import { ListView, ScrollController, SizedBox, Text } from "flitter-core";

const controller = new ScrollController();
const list = SizedBox({
  width: 320,
  height: 400,
  child: ListView.builder({
    controller,
    itemCount: 10000,
    itemExtent: 40,
    cacheExtent: 120,
    keepAliveCount: 20,
    itemBuilder: (index, context) => Text(`Row ${index + 1}`),
  }),
});

controller.jumpTo(4000);
await controller.animateTo(0, { duration: 300 });
// Dispose a caller-owned controller when its screen is removed.
controller.dispose();
```

`itemBuilder` receives the index first and the Flitter `BuildContext` second.
Use `StatefulWidget`, `State`, and `setState()` inside interactive rows. An
internal controller is created and disposed automatically when none is provided.
Mouse wheel and mouse drag input scroll the list; set `scrollDirection: "horizontal"` (or
`Axis.horizontal`) for horizontal content. Eager widget input is also supported
with `ListView({ children: [...] })`; use `itemBuilder` to avoid creating all
widgets up front. Lazy lists require a finite `itemCount`; open-ended delegates are
not supported.

- `itemExtent` gives every row the same main-axis size. Initial layout and large
  jumps calculate the visible index directly, independent of `itemCount`.
- Omit `itemExtent` for variable-size rows. The list remembers measured offsets
  and estimates its scroll extent from measured rows (`estimatedItemExtent`
  defaults to 50 before any measurements). Jumping into an unmeasured region
  must measure the intervening rows; provide `itemExtent` for constant-time
  jumps. Scroll metrics become exact once every row has been measured.
- `padding` accepts `EdgeInsets`: main-axis padding scrolls with the content;
  cross-axis padding reduces the available row width or height.
- `reverse: true` places index 0 at the bottom (vertical) or right (horizontal),
  with offset 0 at that end. Wheel and drag directions follow this orientation.
- `physics` defaults to `ClampingScrollPhysics`. `NeverScrollableScrollPhysics`
  disables wheel and drag input while preserving programmatic control.
- `cacheExtent` (default 250 pixels) mounts rows just before and after the viewport.
- `keepAliveCount` (default 20) retains a bounded cache of inactive row elements
  by index. Returning to a cached index restores its state; evicted rows are
  disposed. Set it to 0 to dispose rows as soon as they leave the cache window.
  State follows indices; reordering data should use a new list key when index
  identity changes. A changed row widget key also replaces that row's state.

For several sections, compose `SliverList` and `SliverFixedExtentList` inside
`Viewport({ controller, slivers: [...] })`. `Viewport` clips both renderers and
hit testing to its bounds; it is controlled programmatically, while `ListView`
adds wheel and mouse drag handling. `SliverConstraints` and `SliverGeometry` define the layout
protocol for custom slivers. Off-screen sections report their scroll geometry
without constructing their row elements.

Run the virtualization checks with:

```bash
pnpm --dir dev/performance run test:slivers
```
