# Network Graph — Radix-Like Spec

## Status
planned

## Purpose
Use a network graph (force-directed graph) to visualize relationships between entities as a node-link diagram. Ideal for social networks, dependency trees, knowledge graphs, and any relational data where connections and clusters matter.

## Data Shape
```typescript
type NetworkGraphData = {
  nodes: {
    id: string;
    label?: string;
    group?: string;
    size?: number;
  }[];
  edges: {
    source: string;  // node id
    target: string;  // node id
    weight?: number;
  }[];
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (graph, legend, title) |
| graph | nodes, edges, simulation | Container for the graph visualization |
| node | nodeData, x, y, index | Individual node circle/shape |
| edge | edgeData, sourceXY, targetXY, index | Line connecting two nodes |
| nodeLabel | label, x, y, index | Text label for a node |
| edgeLabel | weight, midX, midY, index | Optional weight label on edge |
| legend | groups, toggleGroup | Interactive legend for groups |
| title | text | Chart title |

## Controller Methods
- `hoverNode(nodeId)` — highlight a node and its connected edges
- `unhoverNode()` — clear hover state
- `hoverEdge(sourceId, targetId)` — highlight an edge and its endpoints
- `unhoverEdge()` — clear edge hover
- `dragNode(nodeId, x, y)` — update a node's position during drag
- `releaseNode(nodeId)` — release a dragged node back to simulation
- `toggleGroup(group)` — show/hide a group of nodes
- `setSize(width, height)` — update chart dimensions
- `zoomTo(scale, centerX, centerY)` — zoom and pan the view

## Style Presets
- toast: `node: { colors: string[], minRadius: number, maxRadius: number }, edge: { color: string, strokeWidth: number, opacity: number }, label: { fontSize: number }`, legend, title styling

## UX Patterns
- Force simulation: nodes repel each other; edges act as springs; iterative layout
- Node hover: highlights the node and all directly connected edges; dims unconnected nodes
- Node drag: click-drag a node to reposition it; simulation continues around it
- Edge hover: highlights the edge and its source/target nodes
- Zoom and pan: mouse wheel to zoom; drag background to pan
- Group coloring: nodes in the same group share a color
- Node sizing: node radius can encode a data attribute (degree, custom size)
- Legend filtering: toggle groups to show/hide clusters of nodes
- Animation: nodes start at random positions and settle via force simulation

## Storybook Stories Required
- Basic
- Grouped nodes
- Weighted edges
- Node drag interaction
- Zoom and pan
- Custom slot override
- With tooltip interaction
- Large graph
