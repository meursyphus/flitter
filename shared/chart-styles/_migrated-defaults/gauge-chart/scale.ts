import type { GaugeChartCustom } from "../types";
import { CustomPaint } from "flitter-core";

export function Scale(
  ...[{ min, max, zones }]: Parameters<GaugeChartCustom["scale"]>
) {
  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => {
          const elements: Record<string, SVGElement> = {
            bg: context.createSvgEl("path"),
          };
          zones.forEach((_, i) => {
            elements[`zone${i}`] = context.createSvgEl("path");
          });
          elements["minLabel"] = context.createSvgEl("text");
          elements["maxLabel"] = context.createSvgEl("text");
          return elements;
        },
        paint: (elements, { width, height }) => {
          const cx = width / 2;
          const cy = height;
          const outerRadius = Math.min(width / 2, height) * 0.95;
          const innerRadius = outerRadius * 0.75;

          // Background arc
          elements.bg.setAttribute(
            "d",
            describeArc(cx, cy, outerRadius, innerRadius, Math.PI, 2 * Math.PI),
          );
          elements.bg.setAttribute("fill", "#e0e0e0");

          // Zone arcs
          zones.forEach((zone, i) => {
            const startRatio = (zone.min - min) / (max - min);
            const endRatio = (zone.max - min) / (max - min);
            const startAngle = Math.PI + startRatio * Math.PI;
            const endAngle = Math.PI + endRatio * Math.PI;
            elements[`zone${i}`].setAttribute(
              "d",
              describeArc(cx, cy, outerRadius, innerRadius, startAngle, endAngle),
            );
            elements[`zone${i}`].setAttribute("fill", zone.color);
          });

          // Min label
          const minEl = elements["minLabel"];
          minEl.setAttribute("x", `${cx - outerRadius}`);
          minEl.setAttribute("y", `${cy + 16}`);
          minEl.setAttribute("text-anchor", "middle");
          minEl.setAttribute("font-size", "12");
          minEl.setAttribute("fill", "#666");
          minEl.textContent = min.toString();

          // Max label
          const maxEl = elements["maxLabel"];
          maxEl.setAttribute("x", `${cx + outerRadius}`);
          maxEl.setAttribute("y", `${cy + 16}`);
          maxEl.setAttribute("text-anchor", "middle");
          maxEl.setAttribute("font-size", "12");
          maxEl.setAttribute("fill", "#666");
          maxEl.textContent = max.toString();
        },
      },
      canvas: {
        paint: (context, { width, height }) => {
          const cx = width / 2;
          const cy = height;
          const outerRadius = Math.min(width / 2, height) * 0.95;
          const innerRadius = outerRadius * 0.75;
          const ctx = context.canvas;

          // Background arc
          ctx.fillStyle = "#e0e0e0";
          ctx.beginPath();
          ctx.arc(cx, cy, outerRadius, Math.PI, 2 * Math.PI);
          ctx.arc(cx, cy, innerRadius, 2 * Math.PI, Math.PI, true);
          ctx.closePath();
          ctx.fill();

          // Zone arcs
          zones.forEach((zone) => {
            const startRatio = (zone.min - min) / (max - min);
            const endRatio = (zone.max - min) / (max - min);
            const startAngle = Math.PI + startRatio * Math.PI;
            const endAngle = Math.PI + endRatio * Math.PI;

            ctx.fillStyle = zone.color;
            ctx.beginPath();
            ctx.arc(cx, cy, outerRadius, startAngle, endAngle);
            ctx.arc(cx, cy, innerRadius, endAngle, startAngle, true);
            ctx.closePath();
            ctx.fill();
          });

          // Min/Max labels
          ctx.fillStyle = "#666";
          ctx.font = "12px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(min.toString(), cx - outerRadius, cy + 16);
          ctx.fillText(max.toString(), cx + outerRadius, cy + 16);
        },
      },
    },
  });
}

function describeArc(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const outerStartX = cx + outerR * Math.cos(startAngle);
  const outerStartY = cy + outerR * Math.sin(startAngle);
  const outerEndX = cx + outerR * Math.cos(endAngle);
  const outerEndY = cy + outerR * Math.sin(endAngle);
  const innerStartX = cx + innerR * Math.cos(endAngle);
  const innerStartY = cy + innerR * Math.sin(endAngle);
  const innerEndX = cx + innerR * Math.cos(startAngle);
  const innerEndY = cy + innerR * Math.sin(startAngle);

  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${outerStartX} ${outerStartY}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEndX} ${outerEndY}`,
    `L ${innerStartX} ${innerStartY}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEndX} ${innerEndY}`,
    `Z`,
  ].join(" ");
}
