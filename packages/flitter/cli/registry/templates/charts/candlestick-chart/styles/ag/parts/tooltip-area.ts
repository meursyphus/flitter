import {
  AnimatedOpacity,
  AnimatedPositioned,
  BorderRadius,
  BoxDecoration,
  ConstraintsTransformBox,
  Container,
  Curves,
  CustomPaint,
  EdgeInsets,
  FractionalTranslation,
  GestureDetector,
  Offset,
  Positioned,
  Radius,
  Size,
  SizedBox,
  Stack,
  StackFit,
  StatefulWidget,
  State,
  Text,
  TextStyle,
  type Widget,
  ZIndex,
} from "flitter-core";
import type {
  CandlestickChartContext,
  CandlestickChartCustom,
} from "@headless/candlestick-chart/types";
import type { CandlestickChartConfig } from "../config";

const TOOLTIP_OFFSET = 12;
const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;
const MOUSE_THRESHOLD = 3;
const CROSSHAIR_COLOR = "rgba(28, 31, 34, 0.75)";
const CROSSHAIR_DASH = [6, 4];
const AXIS_LABEL_GAP = 8;
const AXIS_LABEL_PADDING_X = 10;
const AXIS_LABEL_PADDING_Y = 6;

type HoveredCandlestick = {
  index: number;
  candle: {
    label: string;
  };
  x: number;
  y: number;
  width: number;
  height: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function dashedLine({
  color,
  dash,
  isVertical,
  length,
}: {
  color: string;
  dash: number[];
  isVertical: boolean;
  length: number;
}): Widget {
  return SizedBox({
    width: isVertical ? 1 : length,
    height: isVertical ? length : 1,
    child: CustomPaint({
      size: new Size({
        width: isVertical ? 1 : length,
        height: isVertical ? length : 1,
      }),
      painter: {
        svg: {
          createDefaultSvgEl: (ctx) => ({
            line: ctx.createSvgEl("line"),
          }),
          paint: ({ line }, size) => {
            line.setAttribute("x1", "0");
            line.setAttribute("y1", "0");
            line.setAttribute("x2", isVertical ? "0" : `${size.width}`);
            line.setAttribute("y2", isVertical ? `${size.height}` : "0");
            line.setAttribute("stroke", color);
            line.setAttribute("stroke-width", "1");
            line.setAttribute("stroke-dasharray", dash.join(","));
          },
        },
        canvas: {
          paint: (ctx, size) => {
            const canvas = ctx.canvas;
            canvas.beginPath();
            canvas.setLineDash(dash);
            canvas.strokeStyle = color;
            canvas.lineWidth = 1;
            canvas.moveTo(0, 0);
            canvas.lineTo(
              isVertical ? 0 : size.width,
              isVertical ? size.height : 0,
            );
            canvas.stroke();
            canvas.setLineDash([]);
          },
        },
      },
    }),
  });
}

function axisCallout(
  text: string,
  context: CandlestickChartContext<CandlestickChartConfig>,
): Widget {
  return Container({
    padding: EdgeInsets.symmetric({
      horizontal: AXIS_LABEL_PADDING_X,
      vertical: AXIS_LABEL_PADDING_Y,
    }),
    decoration: new BoxDecoration({
      color: "#1d2125",
      borderRadius: BorderRadius.all(Radius.circular(4)),
    }),
    child: Text(text, {
      style: new TextStyle({
        fontFamily: context.config.font.family,
        fontSize: 12,
        fontWeight: "600",
        color: "#ffffff",
      }),
    }),
  });
}

function formatYAxisValue(
  value: number,
  context: CandlestickChartContext<CandlestickChartConfig>,
): string {
  const rounded = Math.round(value);
  const raw = `${rounded}`;
  const formatted = context.config.axis.label.format(raw, -1, "y");
  return formatted === raw ? rounded.toLocaleString("en-US") : formatted;
}

class _AgTooltipArea extends StatefulWidget {
  ctx: CandlestickChartContext<CandlestickChartConfig>;
  hoveredCandlestick: HoveredCandlestick | null;
  tooltip: Widget | null;

  constructor({
    ctx,
    hoveredCandlestick,
    tooltip,
  }: {
    ctx: CandlestickChartContext<CandlestickChartConfig>;
    hoveredCandlestick: HoveredCandlestick | null;
    tooltip: Widget | null;
  }) {
    super();
    this.ctx = ctx;
    this.hoveredCandlestick = hoveredCandlestick;
    this.tooltip = tooltip;
  }

  createState() {
    return new _AgTooltipAreaState();
  }
}

class _AgTooltipAreaState extends State<_AgTooltipArea> {
  mouseX = 0;
  mouseY = 0;
  hasMousePosition = false;
  wasVisible = false;
  lastTooltip: Widget | null = null;

  private getLocalPosition(e: MouseEvent): { x: number; y: number } {
    const ro = this.element.renderObject;
    const view = ro.renderOwner.renderContext.view;
    const rect = view.getBoundingClientRect();
    const flitterGlobalX = e.clientX - rect.left;
    const flitterGlobalY = e.clientY - rect.top;
    const overlayGlobal = ro.localToGlobal();
    return {
      x: flitterGlobalX - overlayGlobal.x,
      y: flitterGlobalY - overlayGlobal.y,
    };
  }

  override build(): Widget {
    const { ctx, hoveredCandlestick, tooltip } = this.widget;
    const size = this.element.renderObject.size;

    if (tooltip != null) {
      this.lastTooltip = tooltip;
    }

    const isVisible = tooltip != null;
    const positionDuration = !this.wasVisible && isVisible ? 0 : ANIMATION_DURATION;
    this.wasVisible = isVisible;

    const hoveredCenterX =
      hoveredCandlestick == null
        ? 0
        : hoveredCandlestick.x + hoveredCandlestick.width / 2;
    const activeMouseX = this.hasMousePosition
      ? clamp(this.mouseX, 0, size.width)
      : hoveredCenterX;
    const activeMouseY = this.hasMousePosition
      ? clamp(this.mouseY, 0, size.height)
      : hoveredCandlestick == null
        ? 0
        : hoveredCandlestick.y + hoveredCandlestick.height / 2;
    const scaleRange =
      ctx.scale == null ? 0 : Math.max(ctx.scale.max - ctx.scale.min, 1);
    const hoveredPrice =
      ctx.scale == null
        ? null
        : ctx.scale.max - (activeMouseY / Math.max(size.height, 1)) * scaleRange;

    const children: Widget[] = [
      GestureDetector({
        behavior: "translucent",
        cursor: "default",
        onMouseMove: (e: MouseEvent) => {
          const local = this.getLocalPosition(e);
          const dx = local.x - this.mouseX;
          const dy = local.y - this.mouseY;
          if (dx * dx + dy * dy < MOUSE_THRESHOLD * MOUSE_THRESHOLD) return;
          this.setState(() => {
            this.mouseX = local.x;
            this.mouseY = local.y;
            this.hasMousePosition = true;
          });
        },
        child: SizedBox.expand(),
      }),
    ];

    if (hoveredCandlestick != null && hoveredPrice != null) {
      children.push(
        Positioned({
          left: clamp(hoveredCenterX, 0, size.width),
          top: 0,
          child: dashedLine({
            color: CROSSHAIR_COLOR,
            dash: CROSSHAIR_DASH,
            isVertical: true,
            length: size.height,
          }),
        }),
      );
      children.push(
        Positioned({
          left: 0,
          top: activeMouseY,
          child: dashedLine({
            color: CROSSHAIR_COLOR,
            dash: CROSSHAIR_DASH,
            isVertical: false,
            length: size.width,
          }),
        }),
      );
      children.push(
        Positioned({
          left: clamp(hoveredCenterX, 0, size.width),
          top: size.height + AXIS_LABEL_GAP,
          child: FractionalTranslation({
            translation: new Offset({ x: -0.5, y: 0 }),
            child: axisCallout(hoveredCandlestick.candle.label, ctx),
          }),
        }),
      );
      children.push(
        Positioned({
          left: size.width + AXIS_LABEL_GAP,
          top: activeMouseY,
          child: FractionalTranslation({
            translation: new Offset({ x: 0, y: -0.5 }),
            child: axisCallout(formatYAxisValue(hoveredPrice, ctx), ctx),
          }),
        }),
      );
    }

    if (this.lastTooltip != null) {
      children.push(
        AnimatedPositioned({
          duration: positionDuration,
          curve: Curves.easeOut,
          left: activeMouseX,
          top: activeMouseY - TOOLTIP_OFFSET,
          child: AnimatedOpacity({
            duration: FADE_DURATION,
            opacity: isVisible ? 1 : 0,
            curve: Curves.easeOut,
            child: FractionalTranslation({
              translation: new Offset({ x: -0.5, y: -1 }),
              child: ConstraintsTransformBox({
                constraintsTransform: ConstraintsTransformBox.unconstrained,
                child: ZIndex({
                  zIndex: 9999,
                  child: this.lastTooltip,
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

export function agTooltipArea(
  ...[{ tooltip, hoveredCandlestick }, ctx]: Parameters<
    CandlestickChartCustom<CandlestickChartConfig>["tooltipArea"]
  >
): Widget {
  if (!ctx.config.tooltip.enabled) return SizedBox.shrink();
  return new _AgTooltipArea({ ctx, hoveredCandlestick, tooltip });
}
