import {
  BorderRadius,
  BoxDecoration,
  Container,
  CustomPaint,
  EdgeInsets,
  FractionalTranslation,
  GlobalKey,
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
} from "flitter-ui";
import type {
  CandlestickChartContext,
  CandlestickChartCustom,
} from "flitter-ui/chart";
import { cartesian } from "../../../_shared/ag/index";
import type { CandlestickChartConfig } from "../config";

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

function buildOverlay({
  ctx,
  hoveredCandlestick,
  plotSize,
  mouseY,
  hasMousePosition,
}: {
  ctx: CandlestickChartContext<CandlestickChartConfig>;
  hoveredCandlestick: HoveredCandlestick | null;
  plotSize: { width: number; height: number } | null;
  mouseY: number;
  hasMousePosition: boolean;
}): Widget | null {
  if (hoveredCandlestick == null || plotSize == null || ctx.scale == null) {
    return null;
  }

  const hoveredCenterX = hoveredCandlestick.x + hoveredCandlestick.width / 2;
  const hoveredCenterY = hoveredCandlestick.y + hoveredCandlestick.height / 2;
  const activeMouseY = hasMousePosition
    ? clamp(mouseY, 0, plotSize.height)
    : hoveredCenterY;
  const scaleRange = Math.max(ctx.scale.max - ctx.scale.min, 1);
  const hoveredPrice =
    ctx.scale.max - (activeMouseY / Math.max(plotSize.height, 1)) * scaleRange;

  return Stack({
    fit: StackFit.passthrough,
    clipped: false,
    children: [
      Positioned({
        left: clamp(hoveredCenterX, 0, plotSize.width),
        top: 0,
        child: dashedLine({
          color: CROSSHAIR_COLOR,
          dash: CROSSHAIR_DASH,
          isVertical: true,
          length: plotSize.height,
        }),
      }),
      Positioned({
        left: 0,
        top: activeMouseY,
        child: dashedLine({
          color: CROSSHAIR_COLOR,
          dash: CROSSHAIR_DASH,
          isVertical: false,
          length: plotSize.width,
        }),
      }),
      Positioned({
        left: clamp(hoveredCenterX, 0, plotSize.width),
        top: plotSize.height + AXIS_LABEL_GAP,
        child: FractionalTranslation({
          translation: new Offset({ x: -0.5, y: 0 }),
          child: axisCallout(hoveredCandlestick.candle.label, ctx),
        }),
      }),
      Positioned({
        left: plotSize.width + AXIS_LABEL_GAP,
        top: activeMouseY,
        child: FractionalTranslation({
          translation: new Offset({ x: 0, y: -0.5 }),
          child: axisCallout(formatYAxisValue(hoveredPrice, ctx), ctx),
        }),
      }),
    ],
  });
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
  areaKey = new GlobalKey();
  measuredPlotSize: { width: number; height: number } | null = null;
  scheduledMeasurement = false;

  private schedulePlotMeasurement(): void {
    if (this.scheduledMeasurement) return;
    this.scheduledMeasurement = true;
    this.element.scheduler.addPostFrameCallbacks(() => {
      this.scheduledMeasurement = false;
      if (this.areaKey.buildOwner == null) return;

      const areaRenderObject = this.areaKey.currentContext?.renderObject;
      if (areaRenderObject == null) return;

      const nextSize = {
        width: areaRenderObject.size.width,
        height: areaRenderObject.size.height,
      };

      if (
        this.measuredPlotSize?.width === nextSize.width &&
        this.measuredPlotSize?.height === nextSize.height
      ) {
        return;
      }

      this.setState(() => {
        this.measuredPlotSize = nextSize;
      });
    });
  }

  override build(): Widget {
    const { ctx, hoveredCandlestick, tooltip } = this.widget;
    this.schedulePlotMeasurement();

    return Stack({
      key: this.areaKey,
      fit: StackFit.passthrough,
      clipped: false,
      children: [
        cartesian.agMouseTooltipArea({
          tooltip,
          enabled: ctx.config.tooltip.enabled,
          overlay: ({ hasMousePosition, mouseY }) =>
            buildOverlay({
              ctx,
              hoveredCandlestick,
              plotSize: this.measuredPlotSize,
              mouseY,
              hasMousePosition,
            }),
        }),
      ],
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
