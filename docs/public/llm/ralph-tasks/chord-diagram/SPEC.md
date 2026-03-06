# Chord Diagram — Radix-Like Spec

## Status
planned

## Purpose
Use a chord diagram to visualize flows and relationships between entities in a circular layout. Ideal for showing migration patterns, trade flows, inter-dependencies, and any matrix of connections between groups.

## Data Shape
```typescript
type ChordDiagramData = {
  entities: string[];
  matrix: number[][]; // NxN flow matrix
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (diagram, legend, title) |
| chord | arcs, ribbons | Container for the circular diagram |
| arc | entityIndex, entity, startAngle, endAngle | Outer arc for an entity |
| ribbon | sourceIndex, targetIndex, sourceAngle, targetAngle, value | Flow ribbon between two arcs |
| arcLabel | entity, index, angle | Label for an entity arc |
| arcValue | entity, totalFlow | Value label showing total flow |
| legend | entities, toggleEntity | Interactive legend |
| title | text | Chart title |

## Controller Methods
- `hoverArc(entityIndex)` — highlight an arc and all its connected ribbons
- `unhoverArc()` — clear hover state
- `hoverRibbon(sourceIndex, targetIndex)` — highlight a specific flow
- `unhoverRibbon()` — clear ribbon hover
- `toggleEntity(name)` — show/hide an entity
- `setSize(width, height)` — update chart dimensions

## Style Presets
- toast: `arc: { padAngle: number, colors: string[] }, ribbon: { opacity: number }, label: { fontSize: number }`, legend, title styling

## UX Patterns
- Arc hover: hovering an arc highlights all ribbons connected to that entity; dims unrelated arcs
- Ribbon hover: hovering a ribbon highlights source and target arcs; tooltip shows flow value
- Legend filtering: toggling an entity removes it and redistributes angles
- Animation: arcs and ribbons animate from zero angle to final position on mount
- Color coding: each entity gets a consistent color used for both its arc and outgoing ribbons

## Storybook Stories Required
- Basic
- Large matrix (many entities)
- Custom colors
- With value labels
- Custom slot override
- With tooltip interaction
