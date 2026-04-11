import type { SankeyPoint, SankeyRibbon } from "./types";

type NumericSize = {
  width: number;
  height: number;
};

function scalePoint(point: SankeyPoint, size: NumericSize): SankeyPoint {
  return {
    x: point.x * size.width,
    y: point.y * size.height,
  };
}

export function cubicPoint(
  p0: SankeyPoint,
  p1: SankeyPoint,
  p2: SankeyPoint,
  p3: SankeyPoint,
  t: number,
): SankeyPoint {
  const mt = 1 - t;
  return {
    x:
      mt * mt * mt * p0.x +
      3 * mt * mt * t * p1.x +
      3 * mt * t * t * p2.x +
      t * t * t * p3.x,
    y:
      mt * mt * mt * p0.y +
      3 * mt * mt * t * p1.y +
      3 * mt * t * t * p2.y +
      t * t * t * p3.y,
  };
}

export function resolveRibbonAnchorRect(ribbon: SankeyRibbon) {
  const midX = (ribbon.startTop.x + ribbon.endTop.x) / 2;
  const topMid = cubicPoint(
    ribbon.startTop,
    { x: midX, y: ribbon.startTop.y },
    { x: midX, y: ribbon.endTop.y },
    ribbon.endTop,
    0.5,
  );
  const bottomMid = cubicPoint(
    ribbon.startBottom,
    { x: midX, y: ribbon.startBottom.y },
    { x: midX, y: ribbon.endBottom.y },
    ribbon.endBottom,
    0.5,
  );

  const width = Math.max(Math.abs(ribbon.endTop.x - ribbon.startTop.x) * 0.06, 0.03);
  const height = Math.max(Math.abs(bottomMid.y - topMid.y), 0.03);
  const centerX = (topMid.x + bottomMid.x) / 2;
  const centerY = (topMid.y + bottomMid.y) / 2;

  return {
    x: centerX - width / 2,
    y: centerY - height / 2,
    width,
    height,
    center: {
      x: centerX,
      y: centerY,
    },
  };
}

export function createRibbonPolygon(
  ribbon: SankeyRibbon,
  size: NumericSize,
): SankeyPoint[] {
  const startTop = scalePoint(ribbon.startTop, size);
  const startBottom = scalePoint(ribbon.startBottom, size);
  const endTop = scalePoint(ribbon.endTop, size);
  const endBottom = scalePoint(ribbon.endBottom, size);
  const midX = (startTop.x + endTop.x) / 2;
  const steps = 24;

  const topCurve: SankeyPoint[] = [];
  const bottomCurve: SankeyPoint[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    topCurve.push(
      cubicPoint(
        startTop,
        { x: midX, y: startTop.y },
        { x: midX, y: endTop.y },
        endTop,
        t,
      ),
    );
    bottomCurve.push(
      cubicPoint(
        endBottom,
        { x: midX, y: endBottom.y },
        { x: midX, y: startBottom.y },
        startBottom,
        t,
      ),
    );
  }

  return [...topCurve, ...bottomCurve];
}

export function isPointInPolygon(
  point: SankeyPoint,
  polygon: SankeyPoint[],
): boolean {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i]!.x;
    const yi = polygon[i]!.y;
    const xj = polygon[j]!.x;
    const yj = polygon[j]!.y;

    const intersects =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / ((yj - yi) || 1e-9) + xi;

    if (intersects) inside = !inside;
  }

  return inside;
}
