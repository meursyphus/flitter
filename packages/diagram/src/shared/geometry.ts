export type XYPosition = { x: number; y: number };
export type Dimensions = { width: number; height: number };
export type Rect = XYPosition & Dimensions;
export type Box = { x: number; y: number; x2: number; y2: number };
/** Side of a node a handle sits on. Mirrors React Flow's `Position`. */
export type Position = "top" | "right" | "bottom" | "left";
export type CoordinateExtent = [[number, number], [number, number]];
export type Viewport = { x: number; y: number; zoom: number };
export type SnapGrid = [number, number];

export const infiniteExtent: CoordinateExtent = [
  [-Infinity, -Infinity],
  [Infinity, Infinity],
];

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function distance(a: XYPosition, b: XYPosition): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function clampPosition(
  position: XYPosition,
  extent: CoordinateExtent,
  dimensions?: Partial<Dimensions>,
): XYPosition {
  return {
    x: clamp(position.x, extent[0][0], extent[1][0] - (dimensions?.width ?? 0)),
    y: clamp(position.y, extent[0][1], extent[1][1] - (dimensions?.height ?? 0)),
  };
}

export const rectToBox = ({ x, y, width, height }: Rect): Box => ({
  x,
  y,
  x2: x + width,
  y2: y + height,
});

export const boxToRect = ({ x, y, x2, y2 }: Box): Rect => ({
  x,
  y,
  width: x2 - x,
  height: y2 - y,
});

export const getBoundsOfBoxes = (a: Box, b: Box): Box => ({
  x: Math.min(a.x, b.x),
  y: Math.min(a.y, b.y),
  x2: Math.max(a.x2, b.x2),
  y2: Math.max(a.y2, b.y2),
});

export function getBoundsOfRects(rects: Rect[]): Rect {
  if (rects.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
  let box = rectToBox(rects[0]);
  for (let i = 1; i < rects.length; i++) box = getBoundsOfBoxes(box, rectToBox(rects[i]));
  return boxToRect(box);
}

export function getOverlappingArea(a: Rect, b: Rect): number {
  const xOverlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const yOverlap = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  return Math.ceil(xOverlap * yOverlap);
}

export function rectContains(outer: Rect, inner: Rect): boolean {
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.width <= outer.x + outer.width &&
    inner.y + inner.height <= outer.y + outer.height
  );
}

export function rectContainsPoint(rect: Rect, point: XYPosition): boolean {
  return (
    point.x >= rect.x &&
    point.y >= rect.y &&
    point.x <= rect.x + rect.width &&
    point.y <= rect.y + rect.height
  );
}

export function inflateRect(rect: Rect, delta: number): Rect {
  return {
    x: rect.x - delta,
    y: rect.y - delta,
    width: rect.width + delta * 2,
    height: rect.height + delta * 2,
  };
}

export function rectFromPoints(a: XYPosition, b: XYPosition): Rect {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return { x, y, width: Math.abs(a.x - b.x), height: Math.abs(a.y - b.y) };
}

/** Viewport that fits `bounds` into a `width` x `height` pane (React Flow's fitView math). */
export function getViewportForBounds(
  bounds: Rect,
  width: number,
  height: number,
  minZoom: number,
  maxZoom: number,
  padding = 0.1,
): Viewport {
  const xZoom = width / (bounds.width * (1 + padding));
  const yZoom = height / (bounds.height * (1 + padding));
  const zoom = Math.min(xZoom, yZoom);
  const clampedZoom = clamp(Number.isFinite(zoom) ? zoom : maxZoom, minZoom, maxZoom);
  const boundsCenterX = bounds.x + bounds.width / 2;
  const boundsCenterY = bounds.y + bounds.height / 2;
  return {
    x: width / 2 - boundsCenterX * clampedZoom,
    y: height / 2 - boundsCenterY * clampedZoom,
    zoom: clampedZoom,
  };
}

export function snapPosition(position: XYPosition, snapGrid: SnapGrid = [1, 1]): XYPosition {
  return {
    x: snapGrid[0] * Math.round(position.x / snapGrid[0]),
    y: snapGrid[1] * Math.round(position.y / snapGrid[1]),
  };
}

/** Pane pixel -> flow coordinate. */
export function paneToFlowPosition(
  point: XYPosition,
  viewport: Viewport,
  snapToGrid = false,
  snapGrid: SnapGrid = [1, 1],
): XYPosition {
  const position = {
    x: (point.x - viewport.x) / viewport.zoom,
    y: (point.y - viewport.y) / viewport.zoom,
  };
  return snapToGrid ? snapPosition(position, snapGrid) : position;
}

/** Flow coordinate -> pane pixel. */
export function flowToPanePosition(point: XYPosition, viewport: Viewport): XYPosition {
  return {
    x: point.x * viewport.zoom + viewport.x,
    y: point.y * viewport.zoom + viewport.y,
  };
}

export const handleDirections: Record<Position, XYPosition> = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
};

export function oppositePosition(position: Position): Position {
  switch (position) {
    case "left":
      return "right";
    case "right":
      return "left";
    case "top":
      return "bottom";
    case "bottom":
      return "top";
  }
}

/** Point on the boundary of `rect` at `position` (side midpoint). */
export function rectSidePoint(rect: Rect, position: Position): XYPosition {
  switch (position) {
    case "top":
      return { x: rect.x + rect.width / 2, y: rect.y };
    case "right":
      return { x: rect.x + rect.width, y: rect.y + rect.height / 2 };
    case "bottom":
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height };
    case "left":
      return { x: rect.x, y: rect.y + rect.height / 2 };
  }
}

/**
 * Auto-pan velocity (pixels per frame) when a pointer approaches the pane
 * edge, following React Flow's `calcAutoPan`.
 */
export function calcAutoPan(
  pointer: XYPosition,
  bounds: Dimensions,
  speed = 15,
  distanceFromEdge = 40,
): [number, number] {
  const velocity = (value: number, min: number, max: number) => {
    if (value < min) return clamp(Math.abs(value - min), 1, min) / min;
    if (value > max) return -clamp(Math.abs(value - max), 1, min) / min;
    return 0;
  };
  return [
    velocity(pointer.x, distanceFromEdge, bounds.width - distanceFromEdge) * speed,
    velocity(pointer.y, distanceFromEdge, bounds.height - distanceFromEdge) * speed,
  ];
}

/** Centre of a declared handle on `rect` (side midpoint, `align` fraction, or explicit x/y). */
export function handleCenter(
  spec: { position: Position; align?: number; x?: number; y?: number },
  rect: Rect,
): XYPosition {
  const align = spec.align ?? 0.5;
  let x: number;
  let y: number;
  switch (spec.position) {
    case "top":
      x = rect.x + rect.width * align;
      y = rect.y;
      break;
    case "bottom":
      x = rect.x + rect.width * align;
      y = rect.y + rect.height;
      break;
    case "left":
      x = rect.x;
      y = rect.y + rect.height * align;
      break;
    case "right":
      x = rect.x + rect.width;
      y = rect.y + rect.height * align;
      break;
  }
  if (spec.x != null) x = rect.x + spec.x;
  if (spec.y != null) y = rect.y + spec.y;
  return { x, y };
}

/**
 * Clamp a viewport translation so the visible flow region stays inside
 * `extent` (React Flow's `translateExtent`). When the extent is smaller than
 * the pane on an axis, the extent is centred instead.
 */
export function clampViewportToExtent(
  viewport: Viewport,
  extent: CoordinateExtent,
  pane: Dimensions,
): Viewport {
  const zoom = viewport.zoom;
  const clampAxis = (value: number, min: number, max: number, size: number): number => {
    const upper = Number.isFinite(min) ? -min * zoom + 0 : Infinity; // + 0 normalises -0
    const lower = Number.isFinite(max) ? size - max * zoom : -Infinity;
    if (lower > upper) return (lower + upper) / 2;
    return Math.min(upper, Math.max(lower, value)) + 0;
  };
  return {
    x: clampAxis(viewport.x, extent[0][0], extent[1][0], pane.width),
    y: clampAxis(viewport.y, extent[0][1], extent[1][1], pane.height),
    zoom,
  };
}
