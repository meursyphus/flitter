# Widget Reference

The chart packages rely on a small subset of Flitter widgets repeatedly.

## Layout

### `Column`

```ts
Column({
  children: [title, plot],
  crossAxisAlignment: CrossAxisAlignment.start,
})
```

### `Row`

```ts
Row({
  mainAxisAlignment: MainAxisAlignment.spaceBetween,
  children: labels,
})
```

### `Stack`

```ts
Stack({
  children: [grid, series, labels],
})
```

### `Expanded`

```ts
Column({
  children: [
    title,
    Expanded({ child: plot }),
  ],
})
```

### `SizedBox`

```ts
SizedBox({ width: 12, height: 12 })
```

### `Padding`

```ts
Padding({
  padding: EdgeInsets.all(16),
  child: chart,
})
```

## Drawing

### `Container`

```ts
Container({
  width: Infinity,
  height: Infinity,
  color: "#00a9ff",
})
```

### `CustomPaint`

Use for:

- pie and donut slices
- sankey links
- gauge arcs
- sunburst segments
- network edges

```ts
CustomPaint({
  painter: ({ canvas, size }) => {
    canvas.drawRect(...);
    canvas.drawCircle(...);
    canvas.drawLine(...);
    canvas.drawArc(...);
    canvas.drawPath(...);
  },
})
```

### `ClipRect`

Useful for reveal animations and clipping overflowing chart content.

## Interaction

### `GestureDetector`

```ts
GestureDetector({
  onMouseEnter: () => ctx.hoverBar(index),
  onMouseLeave: () => ctx.unhoverBar(),
  child: bar,
})
```

## Animation

Common pattern:

```ts
const controller = new AnimationController({ duration: 400 });
const anim = new Tween({ begin: 0, end: 1 }).animated(
  new CurvedAnimation({ parent: controller, curve: Curves.easeOut }),
);
```

Use for:

- bar grow-in
- pie sweep-in
- gauge reveal
- node fade/scale entry

## State

### `StatefulWidget` / `State`

Use only for view-local animation state.

### `ChangeNotifier`

Use for chart state:

- scale
- size
- hover
- filtering

### `ChangeNotifierProvider`

All headless charts expose their controller through provider accessors.
