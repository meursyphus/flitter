import type { SankeyChartCustom } from "../types";
import { CustomPaint } from "flitter-core";

export function NodeLabel(
  ...[{ label, x, y, width, height, column, totalColumns }]: Parameters<
    SankeyChartCustom["nodeLabel"]
  >
) {
  const isLastColumn = column === totalColumns - 1;
  const fontSize = 10;

  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => {
          return {
            text: context.createSvgEl("text"),
          };
        },
        paint: ({ text }, size) => {
          const nodeRight = (x + width) * size.width;
          const nodeLeft = x * size.width;
          const centerY = (y + height / 2) * size.height;

          if (isLastColumn) {
            text.setAttribute("x", `${nodeLeft - 6}`);
            text.setAttribute("text-anchor", "end");
          } else {
            text.setAttribute("x", `${nodeRight + 6}`);
            text.setAttribute("text-anchor", "start");
          }
          text.setAttribute("y", `${centerY}`);
          text.setAttribute("dominant-baseline", "central");
          text.setAttribute("font-size", `${fontSize}`);
          text.setAttribute("fill", "#333");
          text.textContent = label;
        },
      },
      canvas: {
        paint: (context, size) => {
          const nodeRight = (x + width) * size.width;
          const nodeLeft = x * size.width;
          const centerY = (y + height / 2) * size.height;

          const ctx = context.canvas;
          ctx.font = `${fontSize}px sans-serif`;
          ctx.fillStyle = "#333";
          ctx.textBaseline = "middle";

          if (isLastColumn) {
            ctx.textAlign = "right";
            ctx.fillText(label, nodeLeft - 6, centerY);
          } else {
            ctx.textAlign = "left";
            ctx.fillText(label, nodeRight + 6, centerY);
          }
        },
      },
    },
  });
}
