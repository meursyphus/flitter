import { describe, expect, it } from "vitest";
import {
  layeredLayout,
  treeLayout,
  gridLayout,
  circularLayout,
  forceLayout,
  manualLayout,
  layoutNodes,
  toLayoutGraph,
} from "../../../packages/diagram/src/shared/layout";

const size = { width: 100, height: 40 };
const nodes = ["a", "b", "c", "d", "e"].map((id) => ({ id, position: { x: 0, y: 0 }, ...size }));
const edges = [
  { id: "ab", source: "a", target: "b" },
  { id: "ac", source: "a", target: "c" },
  { id: "bd", source: "b", target: "d" },
  { id: "cd", source: "c", target: "d" },
  { id: "de", source: "d", target: "e" },
];

function overlaps(positions: Record<string, { x: number; y: number }>) {
  const ids = Object.keys(positions);
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = positions[ids[i]];
      const b = positions[ids[j]];
      const overlap = a.x < b.x + size.width && b.x < a.x + size.width && a.y < b.y + size.height && b.y < a.y + size.height;
      if (overlap) return `${ids[i]} overlaps ${ids[j]}`;
    }
  }
  return null;
}

describe("layout algorithms", () => {
  it("layered layout ranks nodes top to bottom without overlaps", async () => {
    const result = await layeredLayout.compute(toLayoutGraph(nodes, edges));
    const p = result.positions;
    expect(Object.keys(p)).toHaveLength(5);
    expect(p.a.y).toBeLessThan(p.b.y);
    expect(p.b.y).toBe(p.c.y);
    expect(p.d.y).toBeGreaterThan(p.b.y);
    expect(p.e.y).toBeGreaterThan(p.d.y);
    expect(overlaps(p)).toBeNull();
    expect(Math.min(...Object.values(p).map((v) => v.x))).toBe(0);
    expect(Math.min(...Object.values(p).map((v) => v.y))).toBe(0);
  });

  it("layered layout honours LR direction and cycles", async () => {
    const cyclic = [...edges, { id: "ea", source: "e", target: "a" }];
    const result = await layeredLayout.compute(toLayoutGraph(nodes, cyclic, { direction: "LR" }));
    const p = result.positions;
    expect(p.a.x).toBeLessThan(p.b.x);
    expect(p.b.x).toBe(p.c.x);
    expect(overlaps(p)).toBeNull();
  });

  it("tree layout centres parents over children", async () => {
    const tree = [
      { id: "ab", source: "a", target: "b" },
      { id: "ac", source: "a", target: "c" },
      { id: "cd", source: "c", target: "d" },
      { id: "ce", source: "c", target: "e" },
    ];
    const result = await treeLayout.compute(toLayoutGraph(nodes, tree));
    const p = result.positions;
    expect(p.a.y).toBeLessThan(p.b.y);
    expect(p.c.x + size.width / 2).toBeCloseTo((p.d.x + p.e.x + size.width) / 2);
    expect(overlaps(p)).toBeNull();
  });

  it("grid and circular layouts place every node", async () => {
    const grid = await gridLayout.compute(toLayoutGraph(nodes, edges, { columns: 2 }));
    expect(Object.keys(grid.positions)).toHaveLength(5);
    expect(grid.positions.a.y).toBe(grid.positions.b.y);
    expect(grid.positions.c.y).toBeGreaterThan(grid.positions.a.y);
    expect(overlaps(grid.positions)).toBeNull();
    const circle = await circularLayout.compute(toLayoutGraph(nodes, edges));
    expect(Object.keys(circle.positions)).toHaveLength(5);
    expect(overlaps(circle.positions)).toBeNull();
  });

  it("force layout is deterministic and keeps nodes apart", async () => {
    const first = await forceLayout.compute(toLayoutGraph(nodes, edges));
    const second = await forceLayout.compute(toLayoutGraph(nodes, edges));
    expect(first).toEqual(second);
    expect(overlaps(first.positions)).toBeNull();
  });

  it("manual layout and layoutNodes helper", async () => {
    expect((await manualLayout.compute(toLayoutGraph(nodes, edges))).positions).toEqual({});
    const laidOut = await layoutNodes(nodes, edges, layeredLayout);
    expect(laidOut.find((n) => n.id === "e")!.position.y).toBeGreaterThan(0);
    expect(nodes[4].position).toEqual({ x: 0, y: 0 });
  });
});

describe("hierarchical layout (parentId)", () => {
  it("lays out children inside their parent and parents at the root", async () => {
    const { computeHierarchicalLayout } = await import("../../../packages/diagram/src/shared/layout");
    const nested = [
      { id: "group", position: { x: 0, y: 0 }, width: 400, height: 300, data: {} },
      { id: "g1", position: { x: 0, y: 0 }, parentId: "group", ...size },
      { id: "g2", position: { x: 0, y: 0 }, parentId: "group", ...size },
      { id: "outside", position: { x: 0, y: 0 }, ...size },
    ];
    const links = [
      { id: "g1g2", source: "g1", target: "g2" },
      { id: "outside-g1", source: "outside", target: "g1" },
    ];
    const { positions } = await computeHierarchicalLayout(nested, links, layeredLayout, { childPadding: 20 });
    // children are positioned relative to the group, starting at the padding
    expect(positions.g1).toEqual({ x: 20, y: 20 });
    expect(positions.g2.y).toBeGreaterThan(positions.g1.y);
    // the edge from outside into the group ranks the group below "outside" at the root
    expect(positions.outside.y).toBeLessThan(positions.group.y);
    expect(positions.group.x).toBeGreaterThanOrEqual(0);
    expect(Object.keys(positions).sort()).toEqual(["g1", "g2", "group", "outside"]);
  });

  it("grows parents to fit their laid-out children, deepest first", async () => {
    const { computeHierarchicalLayout } = await import("../../../packages/diagram/src/shared/layout");
    const nested = [
      { id: "outer", position: { x: 0, y: 0 }, width: 50, height: 50 },
      { id: "inner", position: { x: 0, y: 0 }, parentId: "outer", width: 100, height: 50 },
      { id: "i1", position: { x: 0, y: 0 }, parentId: "inner", ...size },
      { id: "i2", position: { x: 0, y: 0 }, parentId: "inner", ...size },
      { id: "wide", position: { x: 0, y: 0 }, width: 500, height: 500 },
      { id: "w1", position: { x: 0, y: 0 }, parentId: "wide", ...size },
    ];
    const links = [{ id: "i1i2", source: "i1", target: "i2" }];
    const { positions, dimensions } = await computeHierarchicalLayout(nested, links, layeredLayout, {
      childPadding: 20,
    });
    // i1 (20,20) above i2 (20, 20 + 40 + 100): inner needs 140 x 220
    expect(positions.i2).toEqual({ x: 20, y: 160 });
    expect(dimensions.inner).toEqual({ width: 140, height: 220 });
    // outer is laid out after inner grew, so it wraps the grown size
    expect(dimensions.outer).toEqual({ width: 180, height: 260 });
    // a parent that already fits is never shrunk and is not reported
    expect(dimensions.wide).toBeUndefined();
    expect(Object.keys(dimensions).sort()).toEqual(["inner", "outer"]);

    const kept = await computeHierarchicalLayout(nested, links, layeredLayout, { fitParents: false });
    expect(kept.dimensions).toEqual({});

    const laidOut = await layoutNodes(nested, links, layeredLayout);
    const outer = laidOut.find((n) => n.id === "outer")!;
    expect([outer.width, outer.height]).toEqual([180, 260]);
    expect(laidOut.find((n) => n.id === "wide")!.width).toBe(500);
  });
});
