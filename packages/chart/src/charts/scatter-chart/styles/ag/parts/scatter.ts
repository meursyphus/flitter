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
  GestureDetector,
  ZIndex,
  Padding,
  FractionalTranslation,
  ConstraintsTransformBox,
  Container,
  SizedBox,
  Row,
  Column,
  MainAxisSize,
  Text,
  TextStyle,
  BoxDecoration,
  BoxShadow,
  BorderRadius,
  Border,
  BorderSide,
  Radius,
  EdgeInsets,
  type Widget,
  type TooltipPosition,
} from "flitter-core";
import type { ScatterChartCustom, ScatterChartContext } from "@headless/scatter-chart/types";
import type { AgScatterChartConfig } from "../config";

export const SHAPES = ["circle", "star", "square", "triangle"] as const;
export type Shape = (typeof SHAPES)[number];

// --- Tooltip layout ---

const TOOLTIP_GAP = 8;
const ESTIMATED_TOOLTIP_WIDTH = 220;
const ESTIMATED_TOOLTIP_HEIGHT = 80;
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

// --- AG scatter tooltip content ---

function agScatterTooltipContent({
  legend,
  color,
  x,
  y,
  config,
}: {
  legend: string;
  color: string;
  x: number;
  y: number;
  config: AgScatterChartConfig;
}): Widget {
  const { tooltip, font } = config;

  return Container({
    padding: EdgeInsets.symmetric({ horizontal: tooltip.padding, vertical: tooltip.padding }),
    decoration: new BoxDecoration({
      color: tooltip.backgroundColor,
      borderRadius: tooltip.borderRadius > 0 ? BorderRadius.all(Radius.circular(tooltip.borderRadius)) : undefined,
      border: Border.all({ color: tooltip.borderColor, width: 1 }),
      boxShadow: [
        new BoxShadow({
          color: "rgba(0,0,0,0.15)",
          blurRadius: 16,
        }),
      ],
    }),
    child: Column({
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(legend, {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: 13,
            fontWeight: "600",
            color: tooltip.textColor,
          }),
        }),
        SizedBox({ height: 10 }),
        Row({
          mainAxisSize: MainAxisSize.min,
          children: [
            Container({
              width: 12,
              height: 12,
              decoration: new BoxDecoration({
                color,
                borderRadius: BorderRadius.all(Radius.circular(2)),
              }),
            }),
            SizedBox({ width: 8 }),
            Text(`(${x}, ${y})`, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: 12,
                fontWeight: "bold",
                color: tooltip.textColor,
              }),
            }),
          ],
        }),
      ],
    }),
  });
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

// --- Hoverable scatter ---

class _HoverableScatter extends StatefulWidget {
  pointWidget: Widget;
  legend: string;
  color: string;
  shape: Shape;
  dataX: number;
  dataY: number;
  config: AgScatterChartConfig;

  constructor({
    key,
    pointWidget,
    legend,
    color,
    shape,
    dataX,
    dataY,
    config,
  }: {
    key?: any;
    pointWidget: Widget;
    legend: string;
    color: string;
    shape: Shape;
    dataX: number;
    dataY: number;
    config: AgScatterChartConfig;
  }) {
    super(key);
    this.pointWidget = pointWidget;
    this.legend = legend;
    this.color = color;
    this.shape = shape;
    this.dataX = dataX;
    this.dataY = dataY;
    this.config = config;
  }

  createState() {
    return new _HoverableScatterState();
  }
}

class _HoverableScatterState extends State<_HoverableScatter> {
  hovered = false;
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

  override build(): Widget {
    const { pointWidget, legend, color, shape, dataX, dataY, config } = this.widget;
    const { scatter: scatterConfig } = config;
    const hitSize = scatterConfig.size + HOVER_OUTLINE_EXTRA * 2;

    const children: Widget[] = [];

    // Always keep pointWidget in tree (prevents animation re-trigger)
    children.push(pointWidget);

    // Transparent hit area (Positioned around the 0x0 CustomPaint center)
    children.push(
      Positioned({
        key: "__hit__",
        left: -hitSize / 2,
        top: -hitSize / 2,
        width: hitSize,
        height: hitSize,
        child: GestureDetector({
          cursor: "pointer",
          onMouseEnter: () => {
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
            this.setState(() => {
              this.hovered = true;
            });
          },
          onMouseLeave: () => {
            this.setState(() => {
              this.hovered = false;
            });
          },
          child: SizedBox.expand(),
        }),
      }),
    );

    // Hover: thicker outline (same shape, same color) + tooltip
    if (this.hovered) {
      const outerSize = scatterConfig.size + HOVER_OUTLINE_EXTRA;
      const outerStroke = scatterConfig.strokeWidth + 2;

      children.push(
        CustomPaint({
          key: "__outline__",
          painter: {
            svg: {
              createDefaultSvgEl: (ctx) => ({
                outline: ctx.createSvgEl("path"),
              }),
              paint: ({ outline }) => {
                const path = createShapePath({ shape, size: outerSize });
                outline.setAttribute("fill", scatterConfig.fill ? color : "none");
                outline.setAttribute("stroke", color);
                outline.setAttribute("stroke-width", String(outerStroke));
                outline.setAttribute("d", path.getD());
              },
            },
            canvas: {
              paint: (ctx, _size) => {
                const path = createShapePath({ shape, size: outerSize });
                const canvasPath = path.toCanvasPath();
                if (scatterConfig.fill) {
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
                    child: agScatterTooltipContent({
                      legend,
                      color,
                      x: dataX,
                      y: dataY,
                      config,
                    }),
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

export function agScatter(
  ...[{ legend, label, index }, ctx]: Parameters<ScatterChartCustom<AgScatterChartConfig>["scatter"]>
) {
  const { colors, scatter: scatterConfig, animation, tooltip } = ctx.config;
  const idx = ctx.legends.indexOf(legend);
  const fill = colors.fills[idx % colors.fills.length];
  const stroke = colors.strokes[idx % colors.strokes.length];
  const shape = SHAPES[idx % SHAPES.length];
  const { size, strokeWidth } = scatterConfig;
  const useFill = scatterConfig.fill;

  const point = CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => ({
          scatter: context.createSvgEl("path"),
        }),
        paint: ({ scatter }) => {
          const path = createShapePath({ shape, size });
          if (useFill) {
            scatter.setAttribute("fill", fill);
            scatter.removeAttribute("stroke");
            scatter.removeAttribute("stroke-width");
          } else {
            scatter.setAttribute("fill", "none");
            scatter.setAttribute("stroke", stroke);
            scatter.setAttribute("stroke-width", String(strokeWidth));
          }
          scatter.setAttribute("d", path.getD());
        },
      },
      canvas: {
        paint: (context, _size) => {
          const path = createShapePath({ shape, size });
          if (useFill) {
            context.canvas.fillStyle = fill;
            context.canvas.fill(path.toCanvasPath());
          } else {
            context.canvas.strokeStyle = stroke;
            context.canvas.lineWidth = strokeWidth;
            context.canvas.stroke(path.toCanvasPath());
          }
        },
      },
    },
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

  // Lookup x, y from data
  const dataset = ctx.data.datasets.find((d) => d.legend === legend);
  const dataPoint = dataset?.data[index];

  const color = useFill ? fill : stroke;

  return new _HoverableScatter({
    key: `hover-${legend}-${label}`,
    pointWidget: wrapped,
    legend,
    color,
    shape,
    dataX: dataPoint?.x ?? 0,
    dataY: dataPoint?.y ?? 0,
    config: ctx.config,
  });
}

// --- Shape path ---

export function createShapePath({ shape, size }: { shape: Shape; size: number }): Path {
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
