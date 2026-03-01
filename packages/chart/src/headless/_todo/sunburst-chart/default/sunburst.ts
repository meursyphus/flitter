import type { SunburstCustom, FlatSegment } from "../types";
import { CustomPaint, type Widget } from "flitter-core";

export function Sunburst(
  ...[{ segments }, config]: Parameters<SunburstCustom["sunburst"]>
): Widget {
  const maxDepth = segments.reduce((max, s) => Math.max(max, s.depth), 0);

  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => {
          const els: Record<string, SVGElement> = {};
          segments.forEach((_, i) => {
            els[`seg${i}`] = context.createSvgEl("path");
          });
          return els;
        },
        paint: (els, { width, height }) => {
          const cx = width / 2;
          const cy = height / 2;
          const maxRadius = Math.min(cx, cy) - 10;
          const innerRadius = maxRadius * 0.15;
          const ringWidth = (maxRadius - innerRadius) / maxDepth;

          segments.forEach((seg, i) => {
            const r1 = innerRadius + (seg.depth - 1) * ringWidth;
            const r2 = innerRadius + seg.depth * ringWidth;
            const d = createArcPath(cx, cy, r1, r2, seg.startAngle, seg.endAngle);
            const el = els[`seg${i}`];
            el.setAttribute("d", d);
            el.setAttribute("fill", seg.color);
            el.setAttribute("stroke", "white");
            el.setAttribute("stroke-width", "1");
          });
        },
      },
      canvas: {
        paint: (context, { width, height }) => {
          const cx = width / 2;
          const cy = height / 2;
          const maxRadius = Math.min(cx, cy) - 10;
          const innerRadius = maxRadius * 0.15;
          const ringWidth = (maxRadius - innerRadius) / maxDepth;
          const ctx = context.canvas;

          segments.forEach((seg) => {
            const r1 = innerRadius + (seg.depth - 1) * ringWidth;
            const r2 = innerRadius + seg.depth * ringWidth;

            ctx.beginPath();
            ctx.arc(cx, cy, r2, seg.startAngle - Math.PI / 2, seg.endAngle - Math.PI / 2);
            ctx.arc(cx, cy, r1, seg.endAngle - Math.PI / 2, seg.startAngle - Math.PI / 2, true);
            ctx.closePath();
            ctx.fillStyle = seg.color;
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 1;
            ctx.stroke();
          });
        },
      },
    },
  });
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
): { x: number; y: number } {
  const a = angle - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(a),
    y: cy + radius * Math.sin(a),
  };
}

function createArcPath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const angleDiff = endAngle - startAngle;

  if (angleDiff >= Math.PI * 2 - 0.001) {
    return [
      `M ${cx - outerRadius} ${cy}`,
      `A ${outerRadius} ${outerRadius} 0 1 1 ${cx + outerRadius} ${cy}`,
      `A ${outerRadius} ${outerRadius} 0 1 1 ${cx - outerRadius} ${cy}`,
      `M ${cx - innerRadius} ${cy}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${cx + innerRadius} ${cy}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${cx - innerRadius} ${cy}`,
      `Z`,
    ].join(" ");
  }

  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);
  const largeArc = angleDiff > Math.PI ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    `Z`,
  ].join(" ");
}
