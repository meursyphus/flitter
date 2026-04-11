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
  Stack,
  StackFit,
  Positioned,
  ZIndex,
  Padding,
  FractionalTranslation,
  ConstraintsTransformBox,
  SizedBox,
  EdgeInsets,
  type Widget,
  type TooltipPosition,
} from "flitter-core";
import type { ScatterChartCustom, ScatterChartContext } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "../config";

export const SHAPES = ["circle", "star", "square", "triangle"] as const;
export type Shape = (typeof SHAPES)[number];

// --- Tooltip layout ---

const TOOLTIP_GAP = 8;
const ESTIMATED_TOOLTIP_WIDTH = 220;
const ESTIMATED_TOOLTIP_HEIGHT = 60;
const HOVER_OUTLINE_EXTRA = 4;

type TooltipLayout = {
  position: TooltipPosition;
  offset: Offset;
  translation: Offset;
  padding: EdgeInsets;
};

function computeTooltipLayout(
  plotGlobal: { x: number; y: number },
  pointGlobal: { x: number; y: number },
  plotWidth: number,
  plotHeight: number,
): TooltipLayout {
  const pointX = pointGlobal.x - plotGlobal.x;
  const pointY = pointGlobal.y - plotGlobal.y;
  const fitsRight = plotWidth - pointX >= ESTIMATED_TOOLTIP_WIDTH + TOOLTIP_GAP;
  const fitsTop = pointY >= ESTIMATED_TOOLTIP_HEIGHT;

  if (fitsRight) {
    return {
      position: fitsTop ? "bottomRight" : "topRight",
      translation: new Offset({ x: 1, y: 0 }),
      offset: Offset.Constants.zero,
      padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
    };
  }
  return {
    position: fitsTop ? "bottomLeft" : "topLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

// --- Mount animation ---

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

// --- Tooltip positioner ---

/**
 * Lightweight StatefulWidget solely for tooltip positioning.
 * Hover state is managed by headless; this only computes layout
 * when isHovered becomes true.
 */
class _TooltipPositioner extends StatefulWidget {
  pointWidget: Widget;
  tooltipWidget: Widget;
  isHovered: boolean;
  shape: Shape;
  color: string;
  scatterSize: number;
  strokeWidth: number;
  fill: boolean;

  constructor({
    pointWidget,
    tooltipWidget,
    isHovered,
    shape,
    color,
    scatterSize,
    strokeWidth,
    fill,
  }: {
    pointWidget: Widget;
    tooltipWidget: Widget;
    isHovered: boolean;
    shape: Shape;
    color: string;
    scatterSize: number;
    strokeWidth: number;
    fill: boolean;
  }) {
    super();
    this.pointWidget = pointWidget;
    this.tooltipWidget = tooltipWidget;
    this.isHovered = isHovered;
    this.shape = shape;
    this.color = color;
    this.scatterSize = scatterSize;
    this.strokeWidth = strokeWidth;
    this.fill = fill;
  }

  createState() {
    return new _TooltipPositionerState();
  }
}

class _TooltipPositionerState extends State<_TooltipPositioner> {
  tooltipLayout: TooltipLayout | null = null;

  private findPlotGlobal(): { x: number; y: number; width: number; height: number } | null {
    let node = this.element.renderObject.parent;
    while (node) {
      const s = node.size;
      if (s && s.width > 100 && s.height > 100) {
        const global = node.localToGlobal();
        return { ...global, width: s.width, height: s.height };
      }
      node = node.parent;
    }
    return null;
  }

  private computeLayout() {
    const plot = this.findPlotGlobal();
    const pointGlobal = this.element.renderObject.localToGlobal();
    if (plot) {
      this.tooltipLayout = computeTooltipLayout(
        plot,
        pointGlobal,
        plot.width,
        plot.height,
      );
    }
  }

  override build(): Widget {
    const { pointWidget, tooltipWidget, isHovered, shape, color, scatterSize, strokeWidth, fill } = this.widget;

    if (isHovered) {
      this.computeLayout();
    }

    const children: Widget[] = [];

    // Always keep pointWidget in tree (prevents animation re-trigger)
    children.push(pointWidget);

    // Hover: thicker outline (same shape, same color) + tooltip
    if (isHovered) {
      const outerSize = scatterSize + HOVER_OUTLINE_EXTRA;
      const outerStroke = strokeWidth + 2;
      const halfOuter = outerSize / 2;
      const offset = (scatterSize - outerSize) / 2;

      children.push(
        Positioned({
          key: "__outline__",
          top: offset, left: offset, right: offset, bottom: offset,
          child: CustomPaint({
            painter: {
              svg: {
                createDefaultSvgEl: (ctx) => ({
                  outline: ctx.createSvgEl("path"),
                }),
                paint: ({ outline }) => {
                  const path = createShapePath({ shape, size: outerSize, center: new Offset({ x: halfOuter, y: halfOuter }) });
                  outline.setAttribute("fill", fill ? color : "none");
                  outline.setAttribute("stroke", color);
                  outline.setAttribute("stroke-width", String(outerStroke));
                  outline.setAttribute("d", path.getD());
                },
              },
              canvas: {
                paint: (ctx, _size) => {
                  const path = createShapePath({ shape, size: outerSize, center: new Offset({ x: halfOuter, y: halfOuter }) });
                  const canvasPath = path.toCanvasPath();
                  if (fill) {
                    ctx.canvas.fillStyle = color;
                    ctx.canvas.fill(canvasPath);
                  }
                  ctx.canvas.strokeStyle = color;
                  ctx.canvas.lineWidth = outerStroke;
                  ctx.canvas.stroke(canvasPath);
                },
              },
            },
          }),
        }),
      );

      const layout = this.tooltipLayout;

      children.push(
        Positioned({
          key: "__tooltip__",
          top: 0, left: 0, bottom: 0, right: 0,
          child: FractionalTranslation({
            translation: layout?.offset ?? Offset.Constants.zero,
            child: ConstraintsTransformBox({
              constraintsTransform: ConstraintsTransformBox.unconstrained,
              alignment: Alignment[layout?.position ?? "topRight"],
              child: FractionalTranslation({
                translation: layout?.translation ?? new Offset({ x: 1, y: 0 }),
                child: ZIndex({
                  zIndex: 9999,
                  child: Padding({
                    padding: layout?.padding ?? EdgeInsets.only({ left: TOOLTIP_GAP }),
                    child: tooltipWidget,
                  }),
                }),
              }),
            }),
          }),
        }),
      );
    }

    return Stack({
      fit: StackFit.passthrough,
      clipped: false,
      children,
    });
  }
}

// --- Main export ---

export function toastScatter(
  ...[{ legend, label, index, isHovered }, ctx]: Parameters<ScatterChartCustom<ToastScatterChartConfig>["scatter"]>
) {
  const { colors, scatter: scatterConfig, animation, tooltip } = ctx.config;
  const idx = ctx.legends.indexOf(legend);
  const color = colors[idx % colors.length];
  const shape = SHAPES[idx % SHAPES.length];
  const { size, fill, strokeWidth } = scatterConfig;

  const halfSize = size / 2;
  const point = SizedBox({
    width: size,
    height: size,
    child: CustomPaint({
      painter: {
        svg: {
          createDefaultSvgEl: (context) => ({
            scatter: context.createSvgEl("path"),
          }),
          paint: ({ scatter }) => {
            const path = createShapePath({ shape, size, center: new Offset({ x: halfSize, y: halfSize }) });
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
            const path = createShapePath({ shape, size, center: new Offset({ x: halfSize, y: halfSize }) });
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
    }),
  });

  let wrapped: Widget = point;

  if (animation.enabled) {
    wrapped = new _MountScale({
      key: `${legend}-${label}`,
      duration: animation.duration,
      child: point,
    });
  }

  if (!tooltip.enabled) return wrapped;

  // Lookup x, y from data for tooltip content
  const dataset = ctx.data.datasets.find((d) => d.legend === legend);
  const dataPoint = dataset?.data[index];

  const tooltipWidget = ctx.custom.tooltip(
    { label: dataPoint?.label ?? label, items: [{ legend, color, value: dataPoint?.y ?? 0 }] },
    ctx,
  );

  return new _TooltipPositioner({
    pointWidget: wrapped,
    tooltipWidget,
    isHovered,
    shape,
    color,
    scatterSize: size,
    strokeWidth,
    fill,
  });
}

// --- Shape path ---

export function createShapePath({ shape, size, center = new Offset({ x: 0, y: 0 }) }: { shape: Shape; size: number; center?: Offset }): Path {
  const halfSize = size / 2;
  const cx = center.x;
  const cy = center.y;
  const path = new Path();

  switch (shape) {
    case "circle": {
      path.addOval(
        Rect.fromCircle({
          center: new Offset({ x: cx, y: cy }),
          radius: halfSize,
        }),
      );
      return path;
    }
    case "square": {
      path.moveTo({ x: cx - halfSize, y: cy - halfSize });
      path.lineTo({ x: cx + halfSize, y: cy - halfSize });
      path.lineTo({ x: cx + halfSize, y: cy + halfSize });
      path.lineTo({ x: cx - halfSize, y: cy + halfSize });
      path.close();
      return path;
    }
    case "triangle": {
      const h = halfSize * Math.sqrt(3);
      path.moveTo({ x: cx, y: cy - halfSize });
      path.lineTo({ x: cx + h / 2, y: cy + halfSize / 2 });
      path.lineTo({ x: cx - h / 2, y: cy + halfSize / 2 });
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
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
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
