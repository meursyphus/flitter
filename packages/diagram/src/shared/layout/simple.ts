import { type LayoutAlgorithm, type LayoutGraph, normalizePositions } from "./types";
import type { XYPosition } from "../geometry";

/** Rows of equally sized cells, `columns` wide (defaults to a square-ish grid). */
export function computeGrid(graph: LayoutGraph): Record<string, XYPosition> {
  const { nodes, options } = graph;
  if (nodes.length === 0) return {};
  const columns = Math.max(1, Number(options.columns ?? Math.ceil(Math.sqrt(nodes.length))));
  const cellWidth = Math.max(...nodes.map((n) => n.width)) + options.nodeSpacing;
  const cellHeight = Math.max(...nodes.map((n) => n.height)) + options.rankSpacing;
  const positions: Record<string, XYPosition> = {};
  nodes.forEach((node, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    positions[node.id] = {
      x: column * cellWidth + (cellWidth - options.nodeSpacing - node.width) / 2,
      y: row * cellHeight + (cellHeight - options.rankSpacing - node.height) / 2,
    };
  });
  return normalizePositions(positions, nodes, options.origin);
}

export const gridLayout: LayoutAlgorithm = {
  name: "grid",
  compute: (graph) => ({ positions: computeGrid(graph) }),
};

/** Nodes evenly spaced on a circle large enough to keep `nodeSpacing` between them. */
export function computeCircular(graph: LayoutGraph): Record<string, XYPosition> {
  const { nodes, options } = graph;
  if (nodes.length === 0) return {};
  const diagonal = Math.max(...nodes.map((n) => Math.hypot(n.width, n.height)));
  const circumference = nodes.length * (diagonal + options.nodeSpacing);
  const radius = Math.max(Number(options.radius ?? 0), circumference / (2 * Math.PI));
  const positions: Record<string, XYPosition> = {};
  nodes.forEach((node, index) => {
    const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
    positions[node.id] = {
      x: radius * Math.cos(angle) - node.width / 2,
      y: radius * Math.sin(angle) - node.height / 2,
    };
  });
  return normalizePositions(positions, nodes, options.origin);
}

export const circularLayout: LayoutAlgorithm = {
  name: "circular",
  compute: (graph) => ({ positions: computeCircular(graph) }),
};

/** Leaves every node where it is; use it to opt out of automatic layout. */
export const manualLayout: LayoutAlgorithm = {
  name: "manual",
  compute: () => ({ positions: {} }),
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fruchterman-Reingold force-directed layout. Deterministic (seeded) so the
 * same graph always lands in the same place.
 */
export function computeForce(graph: LayoutGraph): Record<string, XYPosition> {
  const { nodes, options } = graph;
  if (nodes.length === 0) return {};
  const ids = new Set(nodes.map((n) => n.id));
  const edges = graph.edges.filter((e) => ids.has(e.source) && ids.has(e.target) && e.source !== e.target);
  const iterations = Number(options.iterations ?? 300);
  const random = mulberry32(Number(options.seed ?? 42));
  const avgSize = nodes.reduce((s, n) => s + Math.max(n.width, n.height), 0) / nodes.length;
  const area = nodes.length * Math.pow(avgSize + options.nodeSpacing, 2);
  const side = Math.sqrt(area);
  const k = Math.sqrt(area / nodes.length);
  const index = new Map(nodes.map((n, i) => [n.id, i]));
  const px = nodes.map((n, i) => (Number.isFinite(n.position.x) && (n.position.x !== 0 || n.position.y !== 0) ? n.position.x : random() * side + i * 1e-3));
  const py = nodes.map((n, i) => (Number.isFinite(n.position.y) && (n.position.x !== 0 || n.position.y !== 0) ? n.position.y : random() * side + i * 1e-3));
  let temperature = side / 10;
  const cooling = temperature / (iterations + 1);
  for (let iteration = 0; iteration < iterations; iteration++) {
    const dx = new Array(nodes.length).fill(0);
    const dy = new Array(nodes.length).fill(0);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        let ddx = px[i] - px[j];
        let ddy = py[i] - py[j];
        let dist = Math.hypot(ddx, ddy);
        if (dist < 0.01) {
          ddx = random() - 0.5;
          ddy = random() - 0.5;
          dist = Math.hypot(ddx, ddy);
        }
        const force = (k * k) / dist;
        dx[i] += (ddx / dist) * force;
        dy[i] += (ddy / dist) * force;
        dx[j] -= (ddx / dist) * force;
        dy[j] -= (ddy / dist) * force;
      }
    }
    for (const e of edges) {
      const i = index.get(e.source)!;
      const j = index.get(e.target)!;
      const ddx = px[i] - px[j];
      const ddy = py[i] - py[j];
      const dist = Math.max(Math.hypot(ddx, ddy), 0.01);
      const force = (dist * dist) / k;
      dx[i] -= (ddx / dist) * force;
      dy[i] -= (ddy / dist) * force;
      dx[j] += (ddx / dist) * force;
      dy[j] += (ddy / dist) * force;
    }
    for (let i = 0; i < nodes.length; i++) {
      const dist = Math.max(Math.hypot(dx[i], dy[i]), 0.01);
      const step = Math.min(dist, temperature);
      px[i] += (dx[i] / dist) * step;
      py[i] += (dy[i] / dist) * step;
    }
    temperature = Math.max(temperature - cooling, 0.1);
  }
  const positions: Record<string, XYPosition> = {};
  nodes.forEach((node, i) => {
    positions[node.id] = { x: px[i] - node.width / 2, y: py[i] - node.height / 2 };
  });
  return normalizePositions(positions, nodes, options.origin);
}

export const forceLayout: LayoutAlgorithm = {
  name: "force",
  compute: (graph) => ({ positions: computeForce(graph) }),
};
