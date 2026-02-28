import {
  CustomPaint,
  Path,
  Rect,
  Offset,
  StatefulWidget,
  State,
  AnimationController,
  CurvedAnimation,
  Curves,
  Tween,
  Transform,
  Alignment,
  type Widget,
} from "flitter-core";
import type { ScatterChartCustom } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "../config";

const SHAPES = ["circle", "star", "square", "triangle"] as const;
type Shape = (typeof SHAPES)[number];

class _MountScale extends StatefulWidget {
  child: Widget;
  duration: number;

  constructor({ key, child, duration }: { key?: any; child: Widget; duration: number }) {
    super(key);
    this.child = child;
    this.duration = duration;
  }

  createState() {
    return new _MountScaleState();
  }
}

class _MountScaleState extends State<_MountScale> {
  controller!: AnimationController;
  tween!: { value: number };

  override initState() {
    this.controller = new AnimationController({ duration: this.widget.duration });
    this.controller.addListener(() => this.setState());
    this.tween = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({ parent: this.controller, curve: Curves.easeOut }),
    );
    this.controller.forward();
  }

  override dispose() {
    this.controller.dispose();
  }

  override build() {
    return Transform.scale({
      scale: this.tween.value,
      alignment: Alignment.center,
      child: this.widget.child,
    });
  }
}

export function toastScatter(
  ...[{ legend, label }, ctx]: Parameters<ScatterChartCustom<ToastScatterChartConfig>["scatter"]>
) {
  const { colors, scatter: scatterConfig, animation } = ctx.config;
  const idx = ctx.legends.indexOf(legend);
  const color = colors[idx % colors.length];
  const shape = SHAPES[idx % SHAPES.length];
  const { size, fill, strokeWidth } = scatterConfig;

  const point = CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => ({
          scatter: context.createSvgEl("path"),
        }),
        paint: ({ scatter }) => {
          const path = createShapePath({ shape, size });
          if (fill) {
            scatter.setAttribute("fill", color);
            scatter.removeAttribute("stroke");
            scatter.removeAttribute("stroke-width");
          } else {
            scatter.setAttribute("fill", "none");
            scatter.setAttribute("stroke", color);
            scatter.setAttribute("stroke-width", String(strokeWidth));
          }
          scatter.setAttribute("d", path.getD());
        },
      },
      canvas: {
        paint: (context, _size) => {
          const path = createShapePath({ shape, size });
          if (fill) {
            context.canvas.fillStyle = color;
            context.canvas.fill(path.toCanvasPath());
          } else {
            context.canvas.strokeStyle = color;
            context.canvas.lineWidth = strokeWidth;
            context.canvas.stroke(path.toCanvasPath());
          }
        },
      },
    },
  });

  if (!animation.enabled) return point;

  return new _MountScale({
    key: `${legend}-${label}`,
    duration: animation.duration,
    child: point,
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
