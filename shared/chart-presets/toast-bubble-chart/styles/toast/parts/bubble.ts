import {
  Container,
  BoxDecoration,
  Border,
  BoxShadow,
  Opacity,
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
  SizedBox,
  Row,
  MainAxisSize,
  Text,
  TextStyle,
  BorderRadius,
  Radius,
  EdgeInsets,
  Offset,
  type Widget,
  type TooltipPosition,
} from "flitter-core";
import type { BubbleChartCustom } from "../../../../_flitter/headless/bubble-chart";
import type { ToastBubbleChartConfig } from "../config";

// --- Tooltip layout ---

const TOOLTIP_GAP = 8;
const ESTIMATED_TOOLTIP_WIDTH = 220;
const ESTIMATED_TOOLTIP_HEIGHT = 60;

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

// --- Bubble tooltip content ---

function bubbleTooltipContent({
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
  config: ToastBubbleChartConfig;
}): Widget {
  const { tooltip, font } = config;

  return Container({
    padding: EdgeInsets.symmetric({ horizontal: tooltip.padding + 2, vertical: tooltip.padding }),
    decoration: new BoxDecoration({
      color: tooltip.backgroundColor,
      borderRadius: tooltip.borderRadius > 0 ? BorderRadius.all(Radius.circular(tooltip.borderRadius)) : undefined,
      boxShadow: [
        new BoxShadow({
          color: "rgba(0,0,0,0.2)",
          blurRadius: 16,
        }),
      ],
    }),
    child: Row({
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
        SizedBox({ width: 10 }),
        Text(legend, {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: 12,
            color: tooltip.textColor,
          }),
        }),
        SizedBox({ width: 16 }),
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

// --- Hoverable bubble ---

class _HoverableBubble extends StatefulWidget {
  bubbleWidget: Widget;
  legend: string;
  color: string;
  radius: number;
  dataX: number;
  dataY: number;
  config: ToastBubbleChartConfig;

  constructor({
    key,
    bubbleWidget,
    legend,
    color,
    radius,
    dataX,
    dataY,
    config,
  }: {
    key?: any;
    bubbleWidget: Widget;
    legend: string;
    color: string;
    radius: number;
    dataX: number;
    dataY: number;
    config: ToastBubbleChartConfig;
  }) {
    super(key);
    this.bubbleWidget = bubbleWidget;
    this.legend = legend;
    this.color = color;
    this.radius = radius;
    this.dataX = dataX;
    this.dataY = dataY;
    this.config = config;
  }

  createState() {
    return new _HoverableBubbleState();
  }
}

class _HoverableBubbleState extends State<_HoverableBubble> {
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
    const { bubbleWidget, legend, color, radius, dataX, dataY, config } = this.widget;
    const diameter = radius * 2;

    const children: Widget[] = [];

    // Always keep bubbleWidget in tree (prevents animation re-trigger)
    children.push(bubbleWidget);

    // GestureDetector overlay for hover detection
    children.push(
      Positioned({
        key: "__hit__",
        top: 0, left: 0, bottom: 0, right: 0,
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

    if (this.hovered) {
      // Full opacity bubble + white border + shadow (overlaid)
      children.push(
        Positioned({
          key: "__highlight__",
          top: 0, left: 0, bottom: 0, right: 0,
          child: Container({
            width: diameter,
            height: diameter,
            decoration: new BoxDecoration({
              color,
              shape: "circle",
              border: Border.all({ color: "white", width: 2, strokeAlign: 1 }),
              boxShadow: [
                new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 8 }),
              ],
            }),
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
                    child: bubbleTooltipContent({
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

export function toastBubble(
  ...[{ value, legend, label, index }, ctx]: Parameters<BubbleChartCustom<ToastBubbleChartConfig>["bubble"]>
) {
  const { colors, bubble: bubbleConfig, animation, tooltip } = ctx.config;
  const idx = ctx.legends.indexOf(legend);
  const color = colors[idx % colors.length];

  const { scale } = ctx;
  const normValue = scale != null
    ? (value - scale.value.min) / (scale.value.max - scale.value.min || 1)
    : 0.5;
  const radius = bubbleConfig.minRadius + normValue * (bubbleConfig.maxRadius - bubbleConfig.minRadius);

  const bubble = Opacity({
    opacity: bubbleConfig.opacity,
    child: Container({
      width: radius * 2,
      height: radius * 2,
      decoration: new BoxDecoration({
        color,
        shape: "circle",
      }),
    }),
  });

  let wrapped: Widget = bubble;

  if (animation.enabled) {
    wrapped = new _MountScale({
      key: `${legend}-${label}`,
      duration: animation.duration,
      child: bubble,
    });
  }

  if (!tooltip.enabled) return wrapped;

  // Lookup x, y from data
  const dataset = ctx.data.datasets.find((d) => d.legend === legend);
  const dataPoint = dataset?.data[index];

  return new _HoverableBubble({
    key: `hover-${legend}-${label}`,
    bubbleWidget: wrapped,
    legend,
    color,
    radius,
    dataX: dataPoint?.x ?? 0,
    dataY: dataPoint?.y ?? 0,
    config: ctx.config,
  });
}
