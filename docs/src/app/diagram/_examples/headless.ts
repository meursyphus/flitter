import {
  Alignment, Border, BorderRadius, BoxDecoration, Container, CustomPaint,
  Size, SizedBox, Text, TextStyle, type Widget,
} from "flitter-ui";
import {
  Flow, circularLayout, commandsToD, getStraightPath,
  type FlowCustom, type FlowEdge, type FlowNode,
} from "flitter-ui/diagram";

// This example imports no copied style. Even the config shape belongs to us.
type OrbitTheme = { paper: string; ink: string; accent: string };

// Our painter implements both renderers. The engine supplies local path geometry.
function Stroke(width: number, height: number, d: string, color: string): Widget {
  const dependencies = `${width}|${height}|${d}|${color}`;
  return CustomPaint({
    size: new Size({ width, height }),
    painter: {
      dependencies,
      shouldRepaint: (old) => old.dependencies !== dependencies,
      svg: {
        createDefaultSvgEl: (context) => ({ line: context.createSvgEl("path") }),
        paint: ({ line }) => {
          line.setAttribute("d", d);
          line.setAttribute("stroke", color);
          line.setAttribute("stroke-width", "2");
          line.setAttribute("fill", "none");
        },
      },
      canvas: {
        paint: ({ canvas }) => {
          canvas.save();
          canvas.strokeStyle = color;
          canvas.lineWidth = 2;
          canvas.stroke(new Path2D(d));
          canvas.restore();
        },
      },
    },
  });
}

const orbitParts: FlowCustom<OrbitTheme> = {
  node: ({ node, selected, hovered }, { config }) => Container({
    width: 112, height: 72, alignment: Alignment.center,
    decoration: new BoxDecoration({
      color: selected || hovered ? config.accent : config.paper,
      border: Border.all({ color: config.ink, width: 2 }),
      borderRadius: BorderRadius.circular(36),
    }),
    child: Text(String(node.data.label), { style: new TextStyle({ fontFamily: "system-ui, sans-serif", color: config.ink, fontSize: 14, fontWeight: "bold" }) }),
  }),
  edge: ({ path, size, selected, hovered }, { config }) =>
    Stroke(size.width, size.height, commandsToD(path.commands), selected || hovered ? config.accent : config.ink),
  edgeLabel: () => null,
  handle: ({ handle, isConnectionCandidate }, { config }) => Container({
    width: handle.width, height: handle.height,
    color: isConnectionCandidate ? config.accent : config.ink,
  }),
  defaultHandles: () => [
    { type: "target", position: "left", width: 8, height: 8 },
    { type: "source", position: "right", width: 8, height: 8 },
  ],
  connectionLine: ({ path, size }, { config }) =>
    Stroke(size.width, size.height, commandsToD(path.commands), config.accent),
  background: ({ width, height }, { config }) => Container({ width, height, color: config.paper }),
  selectionBox: ({ rect }, { config }) => Container({
    width: rect.width, height: rect.height,
    decoration: new BoxDecoration({ border: Border.all({ color: config.accent, width: 2 }) }),
  }),
  nodesSelectionRect: () => null,
  edgePath: ({ params }) => getStraightPath(params),
  resizeControl: () => SizedBox({ width: 8, height: 8 }),
  reconnectHandle: ({ size }) => SizedBox({ width: size, height: size }),
};

const nodes: FlowNode[] = ["Discover", "Sketch", "Build", "Review", "Ship", "Learn"].map((label) => ({
  id: label, position: { x: 0, y: 0 }, data: { label },
}));
const edges: FlowEdge[] = nodes.map((node, index) => ({
  id: `e-${index}`, source: node.id, target: nodes[(index + 1) % nodes.length].id,
}));

export default function HeadlessOrbit(theme: "light" | "dark" = "light"): Widget {
  return Flow<OrbitTheme>({
    nodes, edges,
    custom: orbitParts,
    config: theme === "dark"
      ? { paper: "#172820", ink: "#e0edc5", accent: "#50703d" }
      : { paper: "#f2efd8", ink: "#253d2d", accent: "#b5d56a" },
    layout: { algorithm: circularLayout, options: { nodeSpacing: 30 } },
    minZoom: 0.15,
    fitViewOptions: { padding: 0.2, maxZoom: 1 },
  });
}
