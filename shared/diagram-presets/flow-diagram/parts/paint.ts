import { CustomPaint, Size, type Widget } from "flitter-ui";

export type ShapeSpec = {
  d: string;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  dash?: number[];
  dashOffset?: number;
  lineCap?: "butt" | "round" | "square";
};

type ShapeMap = Record<string, ShapeSpec | null>;

function shapeKey(shapes: ShapeMap): string {
  return Object.entries(shapes)
    .map(([name, shape]) =>
      shape
        ? `${name}:${shape.d}|${shape.stroke ?? ""}|${shape.strokeWidth ?? ""}|${shape.fill ?? ""}|${shape.dash?.join(",") ?? ""}|${shape.dashOffset ?? ""}|${shape.lineCap ?? ""}`
        : `${name}:-`,
    )
    .join("\n");
}

/**
 * Draws a fixed set of named SVG path strings in both renderers. Keys must be
 * stable between builds; a `null` shape is hidden.
 */
export function ShapePaint({
  width,
  height,
  shapes,
  key,
}: {
  width: number;
  height: number;
  shapes: ShapeMap;
  key?: unknown;
}): Widget {
  const dependencies = shapeKey(shapes);
  const names = Object.keys(shapes);
  return CustomPaint({
    key,
    size: new Size({ width, height }),
    painter: {
      dependencies,
      shouldRepaint: (old) => old.dependencies !== dependencies,
      svg: {
        createDefaultSvgEl: (context) => {
          const els: Record<string, SVGElement> = {};
          for (const name of names) els[name] = context.createSvgEl("path");
          return els;
        },
        paint: (els) => {
          for (const name of names) {
            const el = els[name];
            if (!el) continue;
            const shape = shapes[name];
            if (!shape) {
              el.setAttribute("display", "none");
              continue;
            }
            el.removeAttribute("display");
            el.setAttribute("d", shape.d);
            el.setAttribute("fill", shape.fill ?? "none");
            el.setAttribute("stroke", shape.stroke ?? "none");
            el.setAttribute("stroke-width", String(shape.strokeWidth ?? 1));
            el.setAttribute("stroke-linecap", shape.lineCap ?? "butt");
            if (shape.dash && shape.dash.length) {
              el.setAttribute("stroke-dasharray", shape.dash.join(" "));
              el.setAttribute("stroke-dashoffset", String(shape.dashOffset ?? 0));
            } else {
              el.removeAttribute("stroke-dasharray");
              el.removeAttribute("stroke-dashoffset");
            }
          }
        },
      },
      canvas: {
        paint: (context) => {
          const ctx = context.canvas;
          for (const name of names) {
            const shape = shapes[name];
            if (!shape) continue;
            const path = new Path2D(shape.d);
            ctx.save();
            if (shape.fill && shape.fill !== "none") {
              ctx.fillStyle = shape.fill;
              ctx.fill(path);
            }
            if (shape.stroke && shape.stroke !== "none") {
              ctx.strokeStyle = shape.stroke;
              ctx.lineWidth = shape.strokeWidth ?? 1;
              ctx.lineCap = shape.lineCap ?? "butt";
              ctx.setLineDash(shape.dash ?? []);
              ctx.lineDashOffset = shape.dashOffset ?? 0;
              ctx.stroke(path);
            }
            ctx.restore();
          }
        },
      },
    },
  });
}

/** Fills an icon path (given in its own viewBox) scaled into a square. */
export function IconPaint({
  d,
  viewBox,
  size,
  color,
}: {
  d: string;
  viewBox: [number, number];
  size: number;
  color: string;
}): Widget {
  const scale = Math.min(size / viewBox[0], size / viewBox[1]);
  const dx = (size - viewBox[0] * scale) / 2;
  const dy = (size - viewBox[1] * scale) / 2;
  const dependencies = `${d}|${size}|${color}`;
  return CustomPaint({
    size: new Size({ width: size, height: size }),
    painter: {
      dependencies,
      shouldRepaint: (old) => old.dependencies !== dependencies,
      svg: {
        // The painter owns the CSS transform of returned elements, so the
        // scaling transform goes on an inner element.
        createDefaultSvgEl: (context) => {
          const group = context.createSvgEl("g");
          group.appendChild(context.createSvgEl("path"));
          return { icon: group };
        },
        paint: ({ icon }) => {
          const path = icon.firstElementChild as SVGElement;
          path.setAttribute("d", d);
          path.setAttribute("fill", color);
          path.setAttribute("transform", `translate(${dx} ${dy}) scale(${scale})`);
        },
      },
      canvas: {
        paint: (context) => {
          const ctx = context.canvas;
          ctx.save();
          ctx.translate(dx, dy);
          ctx.scale(scale, scale);
          ctx.fillStyle = color;
          ctx.fill(new Path2D(d));
          ctx.restore();
        },
      },
    },
  });
}

export function rectPathD(x: number, y: number, width: number, height: number, radius = 0): string {
  if (radius <= 0) return `M${x} ${y}h${width}v${height}h${-width}z`;
  const r = Math.min(radius, width / 2, height / 2);
  return [
    `M${x + r} ${y}`,
    `h${width - 2 * r}`,
    `a${r} ${r} 0 0 1 ${r} ${r}`,
    `v${height - 2 * r}`,
    `a${r} ${r} 0 0 1 ${-r} ${r}`,
    `h${-(width - 2 * r)}`,
    `a${r} ${r} 0 0 1 ${-r} ${-r}`,
    `v${-(height - 2 * r)}`,
    `a${r} ${r} 0 0 1 ${r} ${-r}`,
    "z",
  ].join("");
}
