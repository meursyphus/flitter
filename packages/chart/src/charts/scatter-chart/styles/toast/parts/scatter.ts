import { CustomPaint, Path, Rect, Offset } from "flitter-core";
import type { ScatterChartCustom } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "../config";

const SHAPES = ["circle", "star", "square", "triangle"] as const;
type Shape = (typeof SHAPES)[number];

export function toastScatter(
  ...[{ legend }, ctx]: Parameters<ScatterChartCustom<ToastScatterChartConfig>["scatter"]>
) {
  const { colors, scatter: scatterConfig } = ctx.config;
  const idx = ctx.legends.indexOf(legend);
  const color = colors[idx % colors.length];
  const shape = SHAPES[idx % SHAPES.length];
  const size = scatterConfig.size;

  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => ({
          scatter: context.createSvgEl("path"),
        }),
        paint: ({ scatter }) => {
          const path = createShapePath({ shape, size });
          scatter.setAttribute("fill", color);
          scatter.setAttribute("d", path.getD());
        },
      },
      canvas: {
        paint: (context, _size) => {
          const path = createShapePath({ shape, size });
          context.canvas.fillStyle = color;
          context.canvas.fill(path.toCanvasPath());
        },
      },
    },
  });
}

function createShapePath({ shape, size }: { shape: Shape; size: number }): Path {
  const halfSize = size / 2;
  const path = new Path();

  switch (shape) {
    case "circle": {
      path.addOval(
        Rect.fromCircle({
          center: new Offset({ x: 0, y: 0 }),
          radius: halfSize,
        }),
      );
      return path;
    }
    case "square": {
      path.moveTo({ x: -halfSize, y: -halfSize });
      path.lineTo({ x: halfSize, y: -halfSize });
      path.lineTo({ x: halfSize, y: halfSize });
      path.lineTo({ x: -halfSize, y: halfSize });
      path.close();
      return path;
    }
    case "triangle": {
      const h = halfSize * Math.sqrt(3);
      path.moveTo({ x: 0, y: -halfSize });
      path.lineTo({ x: h / 2, y: halfSize / 2 });
      path.lineTo({ x: -h / 2, y: halfSize / 2 });
      path.close();
      return path;
    }
    case "star": {
      const outerRadius = halfSize;
      const innerRadius = halfSize * 0.4;
      const points = 5;
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / points) * i - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) {
          path.moveTo({ x, y });
        } else {
          path.lineTo({ x, y });
        }
      }
      path.close();
      return path;
    }
  }
}
