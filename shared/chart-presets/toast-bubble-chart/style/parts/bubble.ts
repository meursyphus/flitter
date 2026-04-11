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
  ZIndex,
  Padding,
  FractionalTranslation,
  ConstraintsTransformBox,
  SizedBox,
  EdgeInsets,
  Offset,
  type Widget,
  type TooltipPosition,
} from "flitter-ui";
import Tooltip from "flitter-core/component/Tooltip";
import type { BubbleChartCustom } from "flitter-ui/chart";
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
  bubbleWidget: Widget;
  tooltipWidget: Widget;
  isHovered: boolean;

  constructor({
    bubbleWidget,
    tooltipWidget,
    isHovered,
  }: {
    bubbleWidget: Widget;
    tooltipWidget: Widget;
    isHovered: boolean;
  }) {
    super();
    this.bubbleWidget = bubbleWidget;
    this.tooltipWidget = tooltipWidget;
    this.isHovered = isHovered;
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
    const { isHovered, tooltipWidget, bubbleWidget } = this.widget;

    if (isHovered) {
      this.computeLayout();
    }

    const layout = this.tooltipLayout;

    const content = Stack({
      fit: StackFit.passthrough,
      clipped: false,
      children: [
        bubbleWidget,
        isHovered
          ? Positioned({
              key: "__highlight__",
              top: 0, left: 0, bottom: 0, right: 0,
              child: Container({
                decoration: new BoxDecoration({
                  shape: "circle",
                  border: Border.all({ color: "white", width: 2, strokeAlign: 1 }),
                  boxShadow: [
                    new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 8 }),
                  ],
                }),
              }),
            })
          : SizedBox.shrink(),
      ],
    });

    return Tooltip({
      position: layout?.position ?? "topRight",
      offset: layout?.offset ?? Offset.Constants.zero,
      translation: layout?.translation,
      tooltip: isHovered
        ? ZIndex({
            zIndex: 9999,
            child: Padding({
              padding: layout?.padding ?? EdgeInsets.only({ left: TOOLTIP_GAP }),
              child: tooltipWidget,
            }),
          })
        : SizedBox.shrink(),
      child: content,
    });
  }
}

// --- Main export ---

export function toastBubble(
  ...[{ value, legend, label, index, isHovered }, ctx]: Parameters<BubbleChartCustom<ToastBubbleChartConfig>["bubble"]>
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
    opacity: isHovered ? 1 : bubbleConfig.opacity,
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

  const tooltipWidget = ctx.custom.tooltip(
    { label: dataPoint?.label ?? label, items: [{ legend, color, value }] },
    ctx,
  );

  return new _TooltipPositioner({
    bubbleWidget: wrapped,
    tooltipWidget,
    isHovered,
  });
}
