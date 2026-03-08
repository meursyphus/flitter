import type { SankeyChartCustom } from "../types";
import { CustomPaint, Path } from "flitter-core";
import { HoverTooltip } from "flitter-ui/chart";
import { agTooltipContent, defaultAgCartesianBaseConfig } from "../../ag-base/index";

export function Link(
  ...[{
    source,
    target,
    value,
    sourceX,
    sourceY,
    sourceHeight,
    targetX,
    targetY,
    targetHeight,
    color,
  }, ctx]: Parameters<SankeyChartCustom["link"]>
) {
  const hoveredLink = ctx.hoveredLink;
  const relatedToHoveredNode =
    ctx.hoveredNodeId != null &&
    (ctx.hoveredNodeId === source || ctx.hoveredNodeId === target);
  const isHovered =
    hoveredLink != null &&
    hoveredLink.source === source &&
    hoveredLink.target === target;
  const opacity = hoveredLink
    ? isHovered
      ? 0.85
      : 0.12
    : relatedToHoveredNode
      ? 0.72
      : 0.4;

  return new HoverTooltip({
    position: "topCenter",
    tooltip: agTooltipContent({
      label: `${source} → ${target}`,
      items: { legend: "Flow", color, value },
      config: defaultAgCartesianBaseConfig,
    }),
    onMouseEnter: () => ctx.hoverLink(source, target),
    onMouseLeave: () => ctx.unhoverLink(),
    renderChild: () =>
      CustomPaint({
        painter: {
          hitTest: (position, size) =>
            isPointInRibbon(
              position,
              createLinkPolygon({
                sourceX,
                sourceY,
                sourceHeight,
                targetX,
                targetY,
                targetHeight,
                width: size.width,
                height: size.height,
              }),
            ),
          svg: {
            createDefaultSvgEl: (context) => {
              return {
                path: context.createSvgEl("path"),
              };
            },
            paint: ({ path: pathEl }, size) => {
              const d = createLinkPath({
                sourceX,
                sourceY,
                sourceHeight,
                targetX,
                targetY,
                targetHeight,
                width: size.width,
                height: size.height,
              });
              pathEl.setAttribute("d", d.getD());
              pathEl.setAttribute("fill", color);
              pathEl.setAttribute("opacity", String(opacity));
              if (isHovered) {
                pathEl.setAttribute("filter", "drop-shadow(0 0 8px rgba(0,0,0,0.24))");
              } else {
                pathEl.removeAttribute("filter");
              }
            },
          },
          canvas: {
            paint: (context, size) => {
              const d = createLinkPath({
                sourceX,
                sourceY,
                sourceHeight,
                targetX,
                targetY,
                targetHeight,
                width: size.width,
                height: size.height,
              });
              const canvas = context.canvas;
              canvas.fillStyle = color;
              canvas.globalAlpha = opacity;
              if (isHovered) {
                canvas.shadowColor = "rgba(0,0,0,0.24)";
                canvas.shadowBlur = 8;
              }
              canvas.fill(d.toCanvasPath());
              canvas.globalAlpha = 1.0;
              canvas.shadowBlur = 0;
            },
          },
        },
      }),
  });
}

function createLinkPath({
  sourceX,
  sourceY,
  sourceHeight,
  targetX,
  targetY,
  targetHeight,
  width,
  height,
}: {
  sourceX: number;
  sourceY: number;
  sourceHeight: number;
  targetX: number;
  targetY: number;
  targetHeight: number;
  width: number;
  height: number;
}) {
  const sx = sourceX * width;
  const sy0 = sourceY * height;
  const sy1 = (sourceY + sourceHeight) * height;
  const tx = targetX * width;
  const ty0 = targetY * height;
  const ty1 = (targetY + targetHeight) * height;

  const midX = (sx + tx) / 2;

  const path = new Path();

  // Top edge: source top -> target top (cubic bezier)
  path.moveTo({ x: sx, y: sy0 });
  path.cubicTo({
    startControlPoint: { x: midX, y: sy0 },
    endControlPoint: { x: midX, y: ty0 },
    endPoint: { x: tx, y: ty0 },
  });

  // Right edge: target top -> target bottom
  path.lineTo({ x: tx, y: ty1 });

  // Bottom edge: target bottom -> source bottom (cubic bezier)
  path.cubicTo({
    startControlPoint: { x: midX, y: ty1 },
    endControlPoint: { x: midX, y: sy1 },
    endPoint: { x: sx, y: sy1 },
  });

  // Close path (left edge: source bottom -> source top)
  path.lineTo({ x: sx, y: sy0 });

  return path;
}

function cubicPoint(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number,
) {
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

function createLinkPolygon({
  sourceX,
  sourceY,
  sourceHeight,
  targetX,
  targetY,
  targetHeight,
  width,
  height,
}: {
  sourceX: number;
  sourceY: number;
  sourceHeight: number;
  targetX: number;
  targetY: number;
  targetHeight: number;
  width: number;
  height: number;
}) {
  const sx = sourceX * width;
  const sy0 = sourceY * height;
  const sy1 = (sourceY + sourceHeight) * height;
  const tx = targetX * width;
  const ty0 = targetY * height;
  const ty1 = (targetY + targetHeight) * height;
  const midX = (sx + tx) / 2;
  const steps = 20;

  const top = [];
  const bottom = [];
  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps;
    top.push(
      cubicPoint(
        { x: sx, y: sy0 },
        { x: midX, y: sy0 },
        { x: midX, y: ty0 },
        { x: tx, y: ty0 },
        t,
      ),
    );
    bottom.push(
      cubicPoint(
        { x: tx, y: ty1 },
        { x: midX, y: ty1 },
        { x: midX, y: sy1 },
        { x: sx, y: sy1 },
        t,
      ),
    );
  }

  return [...top, ...bottom];
}

function isPointInRibbon(
  position: { x: number; y: number },
  polygon: { x: number; y: number }[],
) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersects =
      yi > position.y !== yj > position.y &&
      position.x < ((xj - xi) * (position.y - yi)) / ((yj - yi) || 0.00001) + xi;

    if (intersects) inside = !inside;
  }
  return inside;
}
