import { Path } from "flitter-core";

type BezierPoint = {
  x: number;
  y: number;
  controlPoint: {
    prev: { x: number; y: number } | null;
    next: { x: number; y: number } | null;
  };
};

export function drawSplineLine(
  path: Path,
  {
    width,
    height,
    minValue,
    maxValue,
    values,
  }: {
    width: number;
    height: number;
    minValue: number;
    maxValue: number;
    values: number[];
  },
) {
  const count = values.length;
  if (count === 0) return;

  const range = maxValue - minValue;
  const points = values.map((val, i) => {
    const x = count > 1 ? (i / (count - 1)) * width : width / 2;
    const y = range !== 0 ? height - ((val - minValue) / range) * height : height / 2;
    return { x, y };
  });

  if (points.length === 1) {
    path.moveTo(points[0]);
    return;
  }

  const bezierPoints: BezierPoint[] = points.map((p) => ({
    ...p,
    controlPoint: { prev: null, next: null },
  }));
  setSplineControlPoints(bezierPoints);

  bezierPoints.forEach((pt, i) => {
    if (i === 0) {
      path.moveTo(pt);
    } else {
      const prev = bezierPoints[i - 1];
      const startCP = prev.controlPoint.next!;
      const endCP = pt.controlPoint.prev!;
      path.cubicTo({
        startControlPoint: { x: startCP.x, y: startCP.y },
        endControlPoint: { x: endCP.x, y: endCP.y },
        endPoint: { x: pt.x, y: pt.y },
      });
    }
  });
}

function setSplineControlPoints(points: BezierPoint[]) {
  const n = points.length;
  if (n < 2) return;

  if (n === 2) {
    const midX = (points[0].x + points[1].x) / 2;
    const midY = (points[0].y + points[1].y) / 2;
    points[0].controlPoint.next = { x: midX, y: midY };
    points[1].controlPoint.prev = { x: midX, y: midY };
    return;
  }

  for (let i = 0; i < n; i++) {
    const cp = getControlPoints(points, i);
    points[i].controlPoint.prev = cp.prev;
    points[i].controlPoint.next = cp.next;
  }
}

function getControlPoints(
  points: BezierPoint[],
  index: number,
): { prev: { x: number; y: number }; next: { x: number; y: number } } {
  const n = points.length;
  const current = points[index];

  if (index === 0) {
    const next = points[1];
    return {
      prev: { x: current.x, y: current.y },
      next: {
        x: current.x + (next.x - current.x) / 3,
        y: current.y + (next.y - current.y) / 3,
      },
    };
  }

  if (index === n - 1) {
    const prev = points[n - 2];
    return {
      prev: {
        x: current.x - (current.x - prev.x) / 3,
        y: current.y - (current.y - prev.y) / 3,
      },
      next: { x: current.x, y: current.y },
    };
  }

  const prev = points[index - 1];
  const next = points[index + 1];

  const distPrev = getDistance(prev, current);
  const distNext = getDistance(current, next);
  const totalDist = distPrev + distNext;

  const ratio = totalDist !== 0 ? distPrev / totalDist : 0.5;
  const smoothing = 0.25;

  const dx = next.x - prev.x;
  const dy = next.y - prev.y;

  return {
    prev: {
      x: current.x - dx * smoothing * ratio,
      y: current.y - dy * smoothing * ratio,
    },
    next: {
      x: current.x + dx * smoothing * (1 - ratio),
      y: current.y + dy * smoothing * (1 - ratio),
    },
  };
}

function getDistance(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}
