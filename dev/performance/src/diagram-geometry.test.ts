import { describe, expect, it } from "vitest";
import {
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  getStepPath,
  getSimpleBezierPath,
  commandsToD,
  distanceToPolyline,
  pointsBounds,
  translateEdgePath,
  getMarkerCommands,
  commandsEndAngle,
} from "../../../packages/diagram/src/shared/edges";
import {
  getViewportForBounds,
  snapPosition,
  paneToFlowPosition,
  flowToPanePosition,
  clampPosition,
  calcAutoPan,
  getBoundsOfRects,
  rectSidePoint,
} from "../../../packages/diagram/src/shared/geometry";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  reconnectEdge,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
} from "../../../packages/diagram/src/shared/changes";

describe("edge paths (React Flow parity)", () => {
  it("bezier matches React Flow's control points and label centre", () => {
    const path = getBezierPath({ sourceX: 0, sourceY: 0, targetX: 100, targetY: 200 });
    // source bottom -> control (0, 100); target top -> control (100, 100)
    expect(commandsToD(path.commands)).toBe("M0 0C0 100 100 100 100 200");
    expect(path.labelX).toBe(50);
    expect(path.labelY).toBe(100);
    expect(path.points[0]).toEqual({ x: 0, y: 0 });
    expect(path.points[path.points.length - 1]).toEqual({ x: 100, y: 200 });
  });

  it("bezier uses curvature when the target is behind the source", () => {
    const path = getBezierPath({ sourceX: 0, sourceY: 0, targetX: 0, targetY: -100, curvature: 0.25 });
    const control = path.commands[1] as { c1y: number; c2y: number };
    expect(control.c1y).toBeCloseTo(0.25 * 25 * Math.sqrt(100));
    expect(control.c2y).toBeCloseTo(-100 - 0.25 * 25 * Math.sqrt(100));
  });

  it("straight path is a single line segment with its label in the middle", () => {
    const path = getStraightPath({ sourceX: 10, sourceY: 10, targetX: 110, targetY: 60 });
    expect(commandsToD(path.commands)).toBe("M10 10L110 60");
    expect(path.labelX).toBe(60);
    expect(path.labelY).toBe(35);
  });

  it("smoothstep bends around the centre with rounded corners", () => {
    const path = getSmoothStepPath({ sourceX: 0, sourceY: 0, targetX: 200, targetY: 100 });
    const d = commandsToD(path.commands);
    expect(d.startsWith("M0 0")).toBe(true);
    expect(d.endsWith("L200 100")).toBe(true);
    expect(d).toContain("Q");
    expect(path.labelX).toBe(100);
    expect(path.labelY).toBe(50);
  });

  it("step path has no curves", () => {
    const path = getStepPath({ sourceX: 0, sourceY: 0, targetX: 200, targetY: 100 });
    expect(commandsToD(path.commands)).not.toContain("Q");
  });

  it("simple bezier places controls half way", () => {
    const path = getSimpleBezierPath({ sourceX: 0, sourceY: 0, sourcePosition: "right", targetX: 100, targetY: 50, targetPosition: "left" });
    expect(commandsToD(path.commands)).toBe("M0 0C50 0 50 50 100 50");
  });

  it("translates paths and reports bounds", () => {
    const path = getStraightPath({ sourceX: 10, sourceY: 10, targetX: 110, targetY: 60 });
    const moved = translateEdgePath(path, -10, -10);
    expect(commandsToD(moved.commands)).toBe("M0 0L100 50");
    expect(moved.labelX).toBe(50);
    expect(pointsBounds(moved.points)).toEqual({ x: 0, y: 0, width: 100, height: 50 });
  });

  it("hit tests against the sampled polyline", () => {
    const path = getStraightPath({ sourceX: 0, sourceY: 0, targetX: 100, targetY: 0 });
    expect(distanceToPolyline({ x: 50, y: 5 }, path.points)).toBe(5);
    expect(distanceToPolyline({ x: 150, y: 0 }, path.points)).toBe(50);
  });

  it("builds arrow markers pointing along the end tangent", () => {
    const path = getStraightPath({ sourceX: 0, sourceY: 0, targetX: 100, targetY: 0 });
    expect(commandsEndAngle(path.commands)).toBe(0);
    const marker = getMarkerCommands({ x: 100, y: 0 }, 0, { type: "arrowclosed", size: 20 });
    expect(marker[1]).toEqual({ type: "L", x: 100, y: 0 });
    expect((marker[0] as { x: number }).x).toBeCloseTo(95);
    expect(marker).toHaveLength(4);
  });
});

describe("viewport geometry", () => {
  it("fits bounds with padding and clamps zoom", () => {
    const viewport = getViewportForBounds({ x: 0, y: 0, width: 200, height: 100 }, 400, 400, 0.5, 2, 0);
    expect(viewport.zoom).toBe(2);
    expect(viewport.x).toBe(400 / 2 - 100 * 2);
    expect(viewport.y).toBe(400 / 2 - 50 * 2);
    const padded = getViewportForBounds({ x: 0, y: 0, width: 1000, height: 1000 }, 500, 500, 0.5, 2, 0.1);
    expect(padded.zoom).toBe(0.5);
  });

  it("round-trips pane and flow coordinates", () => {
    const viewport = { x: 30, y: -20, zoom: 1.5 };
    const flow = paneToFlowPosition({ x: 90, y: 40 }, viewport);
    expect(flow).toEqual({ x: 40, y: 40 });
    expect(flowToPanePosition(flow, viewport)).toEqual({ x: 90, y: 40 });
  });

  it("snaps, clamps and auto-pans like React Flow", () => {
    expect(snapPosition({ x: 22, y: 38 }, [15, 15])).toEqual({ x: 15, y: 45 });
    expect(clampPosition({ x: -10, y: 500 }, [[0, 0], [400, 300]], { width: 50, height: 50 })).toEqual({ x: 0, y: 250 });
    expect(calcAutoPan({ x: 10, y: 100 }, { width: 500, height: 300 }, 15)[0]).toBeGreaterThan(0);
    expect(calcAutoPan({ x: 495, y: 100 }, { width: 500, height: 300 }, 15)[0]).toBeLessThan(0);
    expect(calcAutoPan({ x: 250, y: 150 }, { width: 500, height: 300 }, 15)).toEqual([0, 0]);
  });

  it("computes bounds and side points", () => {
    const bounds = getBoundsOfRects([
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 50, y: 20, width: 10, height: 10 },
    ]);
    expect(bounds).toEqual({ x: 0, y: 0, width: 60, height: 30 });
    expect(rectSidePoint({ x: 0, y: 0, width: 100, height: 40 }, "right")).toEqual({ x: 100, y: 20 });
  });
});

describe("change helpers", () => {
  const nodes = [
    { id: "a", position: { x: 0, y: 0 }, data: {} },
    { id: "b", position: { x: 10, y: 10 }, data: {} },
  ];
  const edges: { id: string; source: string; target: string; selected?: boolean }[] = [
    { id: "ab", source: "a", target: "b" },
  ];

  it("applies node changes immutably", () => {
    const next = applyNodeChanges(
      [
        { type: "position", id: "a", position: { x: 5, y: 5 }, dragging: true },
        { type: "select", id: "b", selected: true },
        { type: "dimensions", id: "b", dimensions: { width: 150, height: 40 } },
        { type: "add", item: { id: "c", position: { x: 1, y: 1 }, data: {} } },
        { type: "remove", id: "a" },
      ],
      nodes,
    );
    expect(nodes[0].position).toEqual({ x: 0, y: 0 });
    expect(next.map((n) => n.id)).toEqual(["b", "c"]);
    expect(next[0]).toMatchObject({ selected: true, measured: { width: 150, height: 40 } });
  });

  it("adds, reconnects and filters edges", () => {
    const added = addEdge({ source: "b", target: "a", sourceHandle: null, targetHandle: null }, edges);
    expect(added).toHaveLength(2);
    expect(added[1].id).toBe("xy-edge__b-a");
    expect(addEdge({ source: "a", target: "b", sourceHandle: null, targetHandle: null }, edges)).toBe(edges);
    const reconnected = reconnectEdge(edges[0], { source: "a", target: "a", sourceHandle: null, targetHandle: null }, edges);
    expect(reconnected[0].target).toBe("a");
    expect(applyEdgeChanges([{ type: "select", id: "ab", selected: true }], edges)[0].selected).toBe(true);
    expect(getConnectedEdges([{ id: "a" }], edges)).toHaveLength(1);
    expect(getIncomers({ id: "b" }, nodes, edges).map((n) => n.id)).toEqual(["a"]);
    expect(getOutgoers({ id: "a" }, nodes, edges).map((n) => n.id)).toEqual(["b"]);
  });
});

describe("translateExtent", () => {
  it("clamps the translation so the visible region stays inside the extent", async () => {
    const { clampViewportToExtent } = await import("../../../packages/diagram/src/shared/geometry");
    const extent: [[number, number], [number, number]] = [[0, 0], [1000, 800]];
    const pane = { width: 400, height: 300 };
    // top-left corner cannot go past the extent origin
    expect(clampViewportToExtent({ x: 50, y: 20, zoom: 1 }, extent, pane)).toEqual({ x: 0, y: 0, zoom: 1 });
    // bottom-right: right edge at 1000 means x >= 400 - 1000
    expect(clampViewportToExtent({ x: -900, y: -700, zoom: 1 }, extent, pane)).toEqual({ x: -600, y: -500, zoom: 1 });
    // inside stays untouched
    expect(clampViewportToExtent({ x: -100, y: -100, zoom: 1 }, extent, pane)).toEqual({ x: -100, y: -100, zoom: 1 });
    // zoomed out so the extent is smaller than the pane: centre it
    const centred = clampViewportToExtent({ x: 0, y: 0, zoom: 0.25 }, extent, pane);
    expect(centred.x).toBeCloseTo((400 - 250) / 2);
    expect(centred.y).toBeCloseTo((300 - 200) / 2);
    // infinite axes are left alone
    expect(clampViewportToExtent({ x: 123, y: 456, zoom: 1 }, [[-Infinity, 0], [Infinity, 800]], pane)).toEqual({
      x: 123,
      y: 0,
      zoom: 1,
    });
  });
});
