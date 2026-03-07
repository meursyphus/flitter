import type { SankeyChartCustom } from "../types";
import { CustomPaint, Path } from "flitter-core";

export function Link(
  ...[{
    sourceX,
    sourceY,
    sourceHeight,
    targetX,
    targetY,
    targetHeight,
    color,
  }]: Parameters<SankeyChartCustom["link"]>
) {
  return CustomPaint({
    painter: {
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
          pathEl.setAttribute("opacity", "0.4");
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
          const ctx = context.canvas;
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.4;
          ctx.fill(d.toCanvasPath());
          ctx.globalAlpha = 1.0;
        },
      },
    },
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
