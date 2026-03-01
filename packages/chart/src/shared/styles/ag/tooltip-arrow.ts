import { CustomPaint, SizedBox, Size, type Widget } from "flitter-core";

/**
 * Downward-pointing triangle arrow for AG tooltip.
 * Drawn with CustomPaint for SVG/Canvas dual rendering.
 */
export function tooltipArrow({
  width,
  height,
  fillColor,
  borderColor,
}: {
  width: number;
  height: number;
  fillColor: string;
  borderColor: string;
}): Widget {
  return SizedBox({
    width,
    height,
    child: CustomPaint({
      size: new Size({ width, height }),
      painter: {
        svg: {
          createDefaultSvgEl: (ctx) => ({
            fill: ctx.createSvgEl("polygon"),
            borderLeft: ctx.createSvgEl("line"),
            borderRight: ctx.createSvgEl("line"),
          }),
          paint: ({ fill, borderLeft, borderRight }, size) => {
            const w = size.width;
            const h = size.height;
            const cx = w / 2;

            // Filled triangle
            fill.setAttribute("points", `0,0 ${w},0 ${cx},${h}`);
            fill.setAttribute("fill", fillColor);
            fill.setAttribute("stroke", "none");

            // Left diagonal border
            borderLeft.setAttribute("x1", "0");
            borderLeft.setAttribute("y1", "0");
            borderLeft.setAttribute("x2", `${cx}`);
            borderLeft.setAttribute("y2", `${h}`);
            borderLeft.setAttribute("stroke", borderColor);
            borderLeft.setAttribute("stroke-width", "1");

            // Right diagonal border
            borderRight.setAttribute("x1", `${w}`);
            borderRight.setAttribute("y1", "0");
            borderRight.setAttribute("x2", `${cx}`);
            borderRight.setAttribute("y2", `${h}`);
            borderRight.setAttribute("stroke", borderColor);
            borderRight.setAttribute("stroke-width", "1");
          },
        },
        canvas: {
          paint: (ctx, size) => {
            const c = ctx.canvas;
            const w = size.width;
            const h = size.height;
            const cx = w / 2;

            // Fill triangle
            c.beginPath();
            c.moveTo(0, 0);
            c.lineTo(w, 0);
            c.lineTo(cx, h);
            c.closePath();
            c.fillStyle = fillColor;
            c.fill();

            // Border lines (left and right diagonals only)
            c.beginPath();
            c.moveTo(0, 0);
            c.lineTo(cx, h);
            c.lineTo(w, 0);
            c.strokeStyle = borderColor;
            c.lineWidth = 1;
            c.stroke();
          },
        },
      },
    }),
  });
}
