import type { SankeyChartCustom } from "../types";
import { CustomPaint } from "flitter-core";

export function Node(
  ...[{ color, x, y, width, height }]: Parameters<SankeyChartCustom["node"]>
) {
  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => {
          return {
            rect: context.createSvgEl("rect"),
          };
        },
        paint: ({ rect }, size) => {
          const px = x * size.width;
          const py = y * size.height;
          const pw = width * size.width;
          const ph = height * size.height;
          rect.setAttribute("x", `${px}`);
          rect.setAttribute("y", `${py}`);
          rect.setAttribute("width", `${pw}`);
          rect.setAttribute("height", `${ph}`);
          rect.setAttribute("fill", color);
          rect.setAttribute("rx", "2");
        },
      },
      canvas: {
        paint: (context, size) => {
          const px = x * size.width;
          const py = y * size.height;
          const pw = width * size.width;
          const ph = height * size.height;
          const ctx = context.canvas;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.roundRect(px, py, pw, ph, 2);
          ctx.fill();
        },
      },
    },
  });
}
