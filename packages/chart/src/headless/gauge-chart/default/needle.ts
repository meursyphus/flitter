import type { GaugeChartCustom } from "../types";
import { CustomPaint } from "flitter-core";

export function Needle(
  ...[{ ratio }]: Parameters<GaugeChartCustom["needle"]>
) {
  const angle = Math.PI + ratio * Math.PI;

  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => {
          return {
            needle: context.createSvgEl("line"),
            center: context.createSvgEl("circle"),
          };
        },
        paint: ({ needle, center }, { width, height }) => {
          const cx = width / 2;
          const cy = height;
          const radius = Math.min(width / 2, height) * 0.8;

          const tipX = cx + radius * Math.cos(angle);
          const tipY = cy + radius * Math.sin(angle);

          needle.setAttribute("x1", `${cx}`);
          needle.setAttribute("y1", `${cy}`);
          needle.setAttribute("x2", `${tipX}`);
          needle.setAttribute("y2", `${tipY}`);
          needle.setAttribute("stroke", "#333");
          needle.setAttribute("stroke-width", "2.5");
          needle.setAttribute("stroke-linecap", "round");

          center.setAttribute("cx", `${cx}`);
          center.setAttribute("cy", `${cy}`);
          center.setAttribute("r", "5");
          center.setAttribute("fill", "#333");
        },
      },
      canvas: {
        paint: (context, { width, height }) => {
          const cx = width / 2;
          const cy = height;
          const radius = Math.min(width / 2, height) * 0.8;

          const tipX = cx + radius * Math.cos(angle);
          const tipY = cy + radius * Math.sin(angle);

          const ctx = context.canvas;
          ctx.strokeStyle = "#333";
          ctx.lineWidth = 2.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();

          ctx.fillStyle = "#333";
          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fill();
        },
      },
    },
  });
}
