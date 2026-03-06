# Stream Graph — Radix-Like Spec

## Status
planned

## Purpose
Use a stream graph (ThemeRiver) to visualize how the composition of a whole changes over time with a smooth, organic aesthetic. Ideal for showing trends in topic popularity, genre evolution, or any time-series composition where the flowing shape adds narrative value.

## Data Shape
```typescript
type StreamGraphData = {
  labels: string[];  // time points
  datasets: {
    legend: string;
    values: number[];
  }[];
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (stream, legend, title) |
| stream | layers, scales | Container for all stream layers |
| streamLayer | datasetIndex, path, baseline | One layer of the stream |
| layerLabel | datasetIndex, legend, position | Label positioned on a layer |
| xAxis | labels, scale | X-axis (time axis) |
| xAxisLabel | label, index | Individual x-axis label |
| xAxisLine | — | X-axis baseline |
| legend | datasets, toggleSeries | Interactive legend |
| title | text | Chart title |

## Controller Methods
- `hoverLayer(datasetIndex)` — highlight a stream layer, show tooltip
- `unhoverLayer()` — clear hover state
- `toggleSeries(legend)` — show/hide a dataset layer
- `setBaseline(type)` — switch baseline algorithm (wiggle, silhouette, expand, zero)
- `setSize(width, height)` — update chart dimensions

## Style Presets
- toast: `layer: { colors: string[], opacity: number, strokeWidth: number }`, legend, title styling

## UX Patterns
- Layer hover: highlights one layer; dims all others; tooltip shows value at cursor x-position
- Baseline algorithms: wiggle (minimizes slope), silhouette (centered), expand (100%), zero (stacked from bottom)
- Legend filtering: toggling a series removes its layer and reflows remaining layers
- Smooth interpolation: layer boundaries use monotone cubic interpolation for organic curves
- Animation: layers flow outward from center baseline on mount
- Vertical crosshair: on hover, shows values for all layers at the cursor's x-position

## Storybook Stories Required
- Basic
- Different baseline algorithms
- Many layers
- With layer labels
- Custom slot override
- With tooltip interaction
