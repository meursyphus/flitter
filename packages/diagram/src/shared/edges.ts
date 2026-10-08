import { Path } from "flitter-core";
import {
  type Position,
  type Rect,
  type XYPosition,
  distance,
  handleDirections,
} from "./geometry";

/** Absolute path commands; easy to translate and to convert to SVG/Canvas. */
export type PathCommand =
  | { type: "M"; x: number; y: number }
  | { type: "L"; x: number; y: number }
  | { type: "Q"; cx: number; cy: number; x: number; y: number }
  | {
      type: "C";
      c1x: number;
      c1y: number;
      c2x: number;
      c2y: number;
      x: number;
      y: number;
    };

export type EdgePathParams = {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
};

export type EdgePathResult = {
  commands: PathCommand[];
  /** Label anchor (React Flow's labelX/labelY). */
  labelX: number;
  labelY: number;
  offsetX: number;
  offsetY: number;
  /** Sampled polyline along the path, used for hit testing and bounds. */
  points: XYPosition[];
};

export type EdgePathType =
  | "default"
  | "bezier"
  | "simplebezier"
  | "straight"
  | "step"
  | "smoothstep";

export type EdgePathOptions = {
  curvature?: number;
  offset?: number;
  borderRadius?: number;
  centerX?: number;
  centerY?: number;
};

// ---------------------------------------------------------------------------
// Sampling / conversion helpers
// ---------------------------------------------------------------------------

export function sampleCommands(commands: PathCommand[], segments = 12): XYPosition[] {
  const points: XYPosition[] = [];
  let current: XYPosition = { x: 0, y: 0 };
  for (const command of commands) {
    switch (command.type) {
      case "M":
        current = { x: command.x, y: command.y };
        points.push(current);
        break;
      case "L":
        current = { x: command.x, y: command.y };
        points.push(current);
        break;
      case "Q": {
        const start = current;
        for (let i = 1; i <= segments; i++) {
          const t = i / segments;
          const mt = 1 - t;
          points.push({
            x: mt * mt * start.x + 2 * mt * t * command.cx + t * t * command.x,
            y: mt * mt * start.y + 2 * mt * t * command.cy + t * t * command.y,
          });
        }
        current = { x: command.x, y: command.y };
        break;
      }
      case "C": {
        const start = current;
        for (let i = 1; i <= segments; i++) {
          const t = i / segments;
          const mt = 1 - t;
          points.push({
            x:
              mt * mt * mt * start.x +
              3 * mt * mt * t * command.c1x +
              3 * mt * t * t * command.c2x +
              t * t * t * command.x,
            y:
              mt * mt * mt * start.y +
              3 * mt * mt * t * command.c1y +
              3 * mt * t * t * command.c2y +
              t * t * t * command.y,
          });
        }
        current = { x: command.x, y: command.y };
        break;
      }
    }
  }
  return points;
}

export function translateCommands(commands: PathCommand[], dx: number, dy: number): PathCommand[] {
  return commands.map((command) => {
    switch (command.type) {
      case "M":
      case "L":
        return { ...command, x: command.x + dx, y: command.y + dy };
      case "Q":
        return { ...command, cx: command.cx + dx, cy: command.cy + dy, x: command.x + dx, y: command.y + dy };
      case "C":
        return {
          ...command,
          c1x: command.c1x + dx,
          c1y: command.c1y + dy,
          c2x: command.c2x + dx,
          c2y: command.c2y + dy,
          x: command.x + dx,
          y: command.y + dy,
        };
    }
  });
}

export function translateEdgePath(path: EdgePathResult, dx: number, dy: number): EdgePathResult {
  return {
    commands: translateCommands(path.commands, dx, dy),
    labelX: path.labelX + dx,
    labelY: path.labelY + dy,
    offsetX: path.offsetX,
    offsetY: path.offsetY,
    points: path.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
  };
}

export function commandsToD(commands: PathCommand[]): string {
  return commands
    .map((command) => {
      switch (command.type) {
        case "M":
          return `M${command.x} ${command.y}`;
        case "L":
          return `L${command.x} ${command.y}`;
        case "Q":
          return `Q${command.cx} ${command.cy} ${command.x} ${command.y}`;
        case "C":
          return `C${command.c1x} ${command.c1y} ${command.c2x} ${command.c2y} ${command.x} ${command.y}`;
      }
    })
    .join("");
}

export function commandsToPath(commands: PathCommand[], path = new Path()): Path {
  for (const command of commands) {
    switch (command.type) {
      case "M":
        path.moveTo({ x: command.x, y: command.y } as any);
        break;
      case "L":
        path.lineTo({ x: command.x, y: command.y } as any);
        break;
      case "Q":
        path.quadraticBezierTo({
          controlPoint: { x: command.cx, y: command.cy } as any,
          endPoint: { x: command.x, y: command.y } as any,
        });
        break;
      case "C":
        path.cubicTo({
          startControlPoint: { x: command.c1x, y: command.c1y } as any,
          endControlPoint: { x: command.c2x, y: command.c2y } as any,
          endPoint: { x: command.x, y: command.y } as any,
        });
        break;
    }
  }
  return path;
}

export function pointsBounds(points: XYPosition[]): Rect {
  if (points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function distanceToSegment(p: XYPosition, a: XYPosition, b: XYPosition): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return distance(p, a);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared;
  t = Math.max(0, Math.min(1, t));
  return distance(p, { x: a.x + t * dx, y: a.y + t * dy });
}

export function distanceToPolyline(point: XYPosition, points: XYPosition[]): number {
  if (points.length === 0) return Infinity;
  if (points.length === 1) return distance(point, points[0]);
  let min = Infinity;
  for (let i = 0; i < points.length - 1; i++) {
    const d = distanceToSegment(point, points[i], points[i + 1]);
    if (d < min) min = d;
  }
  return min;
}

/** Direction (radians) in which the path arrives at its end point. */
export function commandsEndAngle(commands: PathCommand[]): number {
  const last = commands[commands.length - 1];
  if (!last) return 0;
  let previous: XYPosition | null = null;
  if (last.type === "C") previous = { x: last.c2x, y: last.c2y };
  else if (last.type === "Q") previous = { x: last.cx, y: last.cy };
  else {
    const before = commands[commands.length - 2];
    if (before) previous = { x: before.x, y: before.y };
  }
  if (!previous) return 0;
  return Math.atan2(last.y - previous.y, last.x - previous.x);
}

/** Direction (radians) pointing *into* the path from its start point, reversed for a start marker. */
export function commandsStartAngle(commands: PathCommand[]): number {
  const first = commands[0];
  const second = commands[1];
  if (!first || !second) return 0;
  let next: XYPosition;
  if (second.type === "C") next = { x: second.c1x, y: second.c1y };
  else if (second.type === "Q") next = { x: second.cx, y: second.cy };
  else next = { x: second.x, y: second.y };
  return Math.atan2(first.y - next.y, first.x - next.x);
}

export type MarkerShape = "arrow" | "arrowclosed";

/**
 * Arrow head commands at `point` pointing along `angle`. Geometry mirrors
 * React Flow's marker: a `-10 -10 20 20` viewBox drawn at `size` pixels and
 * scaled by the edge stroke width.
 */
export function getMarkerCommands(
  point: XYPosition,
  angle: number,
  { type = "arrowclosed", size = 12.5, strokeWidth = 1 }: { type?: MarkerShape; size?: number; strokeWidth?: number } = {},
): PathCommand[] {
  const unit = (size / 20) * strokeWidth;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const transform = (x: number, y: number): XYPosition => ({
    x: point.x + (x * cos - y * sin) * unit,
    y: point.y + (x * sin + y * cos) * unit,
  });
  const a = transform(-5, -4);
  const tip = transform(0, 0);
  const b = transform(-5, 4);
  const commands: PathCommand[] = [
    { type: "M", x: a.x, y: a.y },
    { type: "L", x: tip.x, y: tip.y },
    { type: "L", x: b.x, y: b.y },
  ];
  if (type === "arrowclosed") commands.push({ type: "L", x: a.x, y: a.y });
  return commands;
}

// ---------------------------------------------------------------------------
// React Flow path algorithms
// ---------------------------------------------------------------------------

export function getEdgeCenter({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}): [number, number, number, number] {
  const xOffset = Math.abs(targetX - sourceX) / 2;
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
  return [centerX, centerY, xOffset, yOffset];
}

export function getBezierEdgeCenter({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourceControlX,
  sourceControlY,
  targetControlX,
  targetControlY,
}: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourceControlX: number;
  sourceControlY: number;
  targetControlX: number;
  targetControlY: number;
}): [number, number, number, number] {
  const centerX = sourceX * 0.125 + sourceControlX * 0.375 + targetControlX * 0.375 + targetX * 0.125;
  const centerY = sourceY * 0.125 + sourceControlY * 0.375 + targetControlY * 0.375 + targetY * 0.125;
  return [centerX, centerY, Math.abs(centerX - sourceX), Math.abs(centerY - sourceY)];
}

function calculateControlOffset(dist: number, curvature: number): number {
  if (dist >= 0) return 0.5 * dist;
  return curvature * 25 * Math.sqrt(-dist);
}

function getControlWithCurvature({
  pos,
  x1,
  y1,
  x2,
  y2,
  c,
}: {
  pos: Position;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  c: number;
}): [number, number] {
  switch (pos) {
    case "left":
      return [x1 - calculateControlOffset(x1 - x2, c), y1];
    case "right":
      return [x1 + calculateControlOffset(x2 - x1, c), y1];
    case "top":
      return [x1, y1 - calculateControlOffset(y1 - y2, c)];
    case "bottom":
      return [x1, y1 + calculateControlOffset(y2 - y1, c)];
  }
}

function finishCubic(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  sourceControl: [number, number],
  targetControl: [number, number],
): EdgePathResult {
  const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX: sourceControl[0],
    sourceControlY: sourceControl[1],
    targetControlX: targetControl[0],
    targetControlY: targetControl[1],
  });
  const commands: PathCommand[] = [
    { type: "M", x: sourceX, y: sourceY },
    {
      type: "C",
      c1x: sourceControl[0],
      c1y: sourceControl[1],
      c2x: targetControl[0],
      c2y: targetControl[1],
      x: targetX,
      y: targetY,
    },
  ];
  return { commands, labelX, labelY, offsetX, offsetY, points: sampleCommands(commands, 24) };
}

export function getBezierPath({
  sourceX,
  sourceY,
  sourcePosition = "bottom",
  targetX,
  targetY,
  targetPosition = "top",
  curvature = 0.25,
}: EdgePathParams & { curvature?: number }): EdgePathResult {
  const sourceControl = getControlWithCurvature({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
    c: curvature,
  });
  const targetControl = getControlWithCurvature({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
    c: curvature,
  });
  return finishCubic(sourceX, sourceY, targetX, targetY, sourceControl, targetControl);
}

function getSimpleControl({ pos, x1, y1, x2, y2 }: { pos: Position; x1: number; y1: number; x2: number; y2: number }): [number, number] {
  if (pos === "left" || pos === "right") return [0.5 * (x1 + x2), y1];
  return [x1, 0.5 * (y1 + y2)];
}

export function getSimpleBezierPath({
  sourceX,
  sourceY,
  sourcePosition = "bottom",
  targetX,
  targetY,
  targetPosition = "top",
}: EdgePathParams): EdgePathResult {
  const sourceControl = getSimpleControl({ pos: sourcePosition, x1: sourceX, y1: sourceY, x2: targetX, y2: targetY });
  const targetControl = getSimpleControl({ pos: targetPosition, x1: targetX, y1: targetY, x2: sourceX, y2: sourceY });
  return finishCubic(sourceX, sourceY, targetX, targetY, sourceControl, targetControl);
}

export function getStraightPath({ sourceX, sourceY, targetX, targetY }: EdgePathParams): EdgePathResult {
  const [labelX, labelY, offsetX, offsetY] = getEdgeCenter({ sourceX, sourceY, targetX, targetY });
  const commands: PathCommand[] = [
    { type: "M", x: sourceX, y: sourceY },
    { type: "L", x: targetX, y: targetY },
  ];
  return { commands, labelX, labelY, offsetX, offsetY, points: sampleCommands(commands) };
}

function getStepDirection({ source, sourcePosition, target }: { source: XYPosition; sourcePosition: Position; target: XYPosition }): XYPosition {
  if (sourcePosition === "left" || sourcePosition === "right") {
    return source.x < target.x ? { x: 1, y: 0 } : { x: -1, y: 0 };
  }
  return source.y < target.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
}

function getStepPoints({
  source,
  sourcePosition = "bottom",
  target,
  targetPosition = "top",
  center,
  offset,
}: {
  source: XYPosition;
  sourcePosition?: Position;
  target: XYPosition;
  targetPosition?: Position;
  center: Partial<XYPosition>;
  offset: number;
}): [XYPosition[], number, number, number, number] {
  const sourceDir = handleDirections[sourcePosition];
  const targetDir = handleDirections[targetPosition];
  const sourceGapped = { x: source.x + sourceDir.x * offset, y: source.y + sourceDir.y * offset };
  const targetGapped = { x: target.x + targetDir.x * offset, y: target.y + targetDir.y * offset };
  const dir = getStepDirection({ source: sourceGapped, sourcePosition, target: targetGapped });
  const dirAccessor: "x" | "y" = dir.x !== 0 ? "x" : "y";
  const currDir = dir[dirAccessor];
  let points: XYPosition[] = [];
  let centerX: number;
  let centerY: number;
  const sourceGapOffset = { x: 0, y: 0 };
  const targetGapOffset = { x: 0, y: 0 };
  const [defaultCenterX, defaultCenterY, defaultOffsetX, defaultOffsetY] = getEdgeCenter({
    sourceX: source.x,
    sourceY: source.y,
    targetX: target.x,
    targetY: target.y,
  });

  if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
    centerX = center.x ?? defaultCenterX;
    centerY = center.y ?? defaultCenterY;
    const verticalSplit = [
      { x: centerX, y: sourceGapped.y },
      { x: centerX, y: targetGapped.y },
    ];
    const horizontalSplit = [
      { x: sourceGapped.x, y: centerY },
      { x: targetGapped.x, y: centerY },
    ];
    if (sourceDir[dirAccessor] === currDir) {
      points = dirAccessor === "x" ? verticalSplit : horizontalSplit;
    } else {
      points = dirAccessor === "x" ? horizontalSplit : verticalSplit;
    }
  } else {
    const sourceTarget = [{ x: sourceGapped.x, y: targetGapped.y }];
    const targetSource = [{ x: targetGapped.x, y: sourceGapped.y }];
    if (dirAccessor === "x") {
      points = sourceDir.x === currDir ? targetSource : sourceTarget;
    } else {
      points = sourceDir.y === currDir ? sourceTarget : targetSource;
    }
    if (sourcePosition === targetPosition) {
      const diff = Math.abs(source[dirAccessor] - target[dirAccessor]);
      if (diff <= offset) {
        const gapOffset = Math.min(offset - 1, offset - diff);
        if (sourceDir[dirAccessor] === currDir) {
          sourceGapOffset[dirAccessor] = (sourceGapped[dirAccessor] > source[dirAccessor] ? -1 : 1) * gapOffset;
        } else {
          targetGapOffset[dirAccessor] = (targetGapped[dirAccessor] > target[dirAccessor] ? -1 : 1) * gapOffset;
        }
      }
    }
    if (sourcePosition !== targetPosition) {
      const dirAccessorOpposite: "x" | "y" = dirAccessor === "x" ? "y" : "x";
      const isSameDir = sourceDir[dirAccessor] === targetDir[dirAccessorOpposite];
      const sourceGtTargetOppo = sourceGapped[dirAccessorOpposite] > targetGapped[dirAccessorOpposite];
      const sourceLtTargetOppo = sourceGapped[dirAccessorOpposite] < targetGapped[dirAccessorOpposite];
      const flipSourceTarget =
        (sourceDir[dirAccessor] === 1 && ((!isSameDir && sourceGtTargetOppo) || (isSameDir && sourceLtTargetOppo))) ||
        (sourceDir[dirAccessor] !== 1 && ((!isSameDir && sourceLtTargetOppo) || (isSameDir && sourceGtTargetOppo)));
      if (flipSourceTarget) {
        points = dirAccessor === "x" ? sourceTarget : targetSource;
      }
    }
    const sourceGapPoint = { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y };
    const targetGapPoint = { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y };
    const maxXDistance = Math.max(Math.abs(sourceGapPoint.x - points[0].x), Math.abs(targetGapPoint.x - points[0].x));
    const maxYDistance = Math.max(Math.abs(sourceGapPoint.y - points[0].y), Math.abs(targetGapPoint.y - points[0].y));
    if (maxXDistance >= maxYDistance) {
      centerX = (sourceGapPoint.x + targetGapPoint.x) / 2;
      centerY = points[0].y;
    } else {
      centerX = points[0].x;
      centerY = (sourceGapPoint.y + targetGapPoint.y) / 2;
    }
  }

  const pathPoints = [
    source,
    { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y },
    ...points,
    { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y },
    target,
  ];
  return [pathPoints, centerX, centerY, defaultOffsetX, defaultOffsetY];
}

function getBend(a: XYPosition, b: XYPosition, c: XYPosition, size: number): PathCommand[] {
  const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
  const { x, y } = b;
  if ((a.x === x && x === c.x) || (a.y === y && y === c.y) || bendSize <= 0) {
    return [{ type: "L", x, y }];
  }
  if (a.y === y) {
    const xDir = a.x < c.x ? -1 : 1;
    const yDir = a.y < c.y ? 1 : -1;
    return [
      { type: "L", x: x + bendSize * xDir, y },
      { type: "Q", cx: x, cy: y, x, y: y + bendSize * yDir },
    ];
  }
  const xDir = a.x < c.x ? 1 : -1;
  const yDir = a.y < c.y ? -1 : 1;
  return [
    { type: "L", x, y: y + bendSize * yDir },
    { type: "Q", cx: x, cy: y, x: x + bendSize * xDir, y },
  ];
}

export function getSmoothStepPath({
  sourceX,
  sourceY,
  sourcePosition = "bottom",
  targetX,
  targetY,
  targetPosition = "top",
  borderRadius = 5,
  centerX,
  centerY,
  offset = 20,
}: EdgePathParams & { borderRadius?: number; centerX?: number; centerY?: number; offset?: number }): EdgePathResult {
  const [points, labelX, labelY, offsetX, offsetY] = getStepPoints({
    source: { x: sourceX, y: sourceY },
    sourcePosition,
    target: { x: targetX, y: targetY },
    targetPosition,
    center: { x: centerX, y: centerY },
    offset,
  });
  const commands: PathCommand[] = [];
  points.forEach((p, i) => {
    if (i === 0) commands.push({ type: "M", x: p.x, y: p.y });
    else if (i < points.length - 1) commands.push(...getBend(points[i - 1], p, points[i + 1], borderRadius));
    else commands.push({ type: "L", x: p.x, y: p.y });
  });
  return { commands, labelX, labelY, offsetX, offsetY, points: sampleCommands(commands, 4) };
}

export function getStepPath(params: EdgePathParams & { offset?: number; centerX?: number; centerY?: number }): EdgePathResult {
  return getSmoothStepPath({ ...params, borderRadius: 0 });
}

/** Resolve a built-in edge path by its React Flow type name. */
export function getEdgePathByType(
  type: string | undefined,
  params: EdgePathParams,
  options: EdgePathOptions = {},
): EdgePathResult {
  switch (type) {
    case "straight":
      return getStraightPath(params);
    case "step":
      return getStepPath({ ...params, offset: options.offset, centerX: options.centerX, centerY: options.centerY });
    case "smoothstep":
      return getSmoothStepPath({ ...params, ...options });
    case "simplebezier":
      return getSimpleBezierPath(params);
    case "bezier":
    case "default":
    default:
      return getBezierPath({ ...params, curvature: options.curvature });
  }
}
