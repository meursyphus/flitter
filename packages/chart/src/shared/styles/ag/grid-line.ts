import { CustomPaint, SizedBox, Size, type Widget } from "flitter-core";
import type { AgBaseConfig } from "./config";

/**
 * AG Charts uses dashed grid lines (unlike toast which uses solid lines).
 * Implemented with CustomPaint for dash support.
 */

export function agGridXLine(
  args: undefined,
  context: { config: AgBaseConfig },
): Widget {
  const { grid } = context.config;
  return SizedBox({
    width: Infinity,
    height: grid.thickness,
    child: CustomPaint({
      size: Size.infinite,
      painter: {
        svg: {
          createDefaultSvgEl: (ctx) => ({
            line: ctx.createSvgEl("line"),
          }),
          paint: ({ line }, size) => {
            line.setAttribute("x1", "0");
            line.setAttribute("y1", "0");
            line.setAttribute("x2", `${size.width}`);
            line.setAttribute("y2", "0");
            line.setAttribute("stroke", grid.color);
            line.setAttribute("stroke-width", `${grid.thickness}`);
            line.setAttribute("stroke-dasharray", grid.dash.join(","));
          },
        },
        canvas: {
          paint: (ctx, size) => {
            const c = ctx.canvas;
            c.beginPath();
            c.setLineDash(grid.dash);
            c.strokeStyle = grid.color;
            c.lineWidth = grid.thickness;
            c.moveTo(0, 0);
            c.lineTo(size.width, 0);
            c.stroke();
            c.setLineDash([]);
          },
        },
      },
    }),
  });
}

export function agGridYLine(
  args: undefined,
  context: { config: AgBaseConfig },
): Widget {
  const { grid } = context.config;
  return SizedBox({
    width: grid.thickness,
    height: Infinity,
    child: CustomPaint({
      size: Size.infinite,
      painter: {
        svg: {
          createDefaultSvgEl: (ctx) => ({
            line: ctx.createSvgEl("line"),
          }),
          paint: ({ line }, size) => {
            line.setAttribute("x1", "0");
            line.setAttribute("y1", "0");
            line.setAttribute("x2", "0");
            line.setAttribute("y2", `${size.height}`);
            line.setAttribute("stroke", grid.color);
            line.setAttribute("stroke-width", `${grid.thickness}`);
            line.setAttribute("stroke-dasharray", grid.dash.join(","));
          },
        },
        canvas: {
          paint: (ctx, size) => {
            const c = ctx.canvas;
            c.beginPath();
            c.setLineDash(grid.dash);
            c.strokeStyle = grid.color;
            c.lineWidth = grid.thickness;
            c.moveTo(0, 0);
            c.lineTo(0, size.height);
            c.stroke();
            c.setLineDash([]);
          },
        },
      },
    }),
  });
}
