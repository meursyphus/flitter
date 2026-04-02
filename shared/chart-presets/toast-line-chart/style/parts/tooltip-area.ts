import {
  StatefulWidget,
  State,
  SizedBox,
  Stack,
  StackFit,
  Positioned,
  Container,
  ZIndex,
  Padding,
  FractionalTranslation,
  ConstraintsTransformBox,
  Alignment,
  BoxDecoration,
  Border,
  BoxShadow,
  EdgeInsets,
  Offset,
  type Widget,
  type TooltipPosition,
} from "flitter-core";
import type { LineChartCustom } from "flitter-ui/chart";
import type { ToastLineChartConfig } from "../config";

// --- Tooltip layout ---

const TOOLTIP_GAP = 4;
const ESTIMATED_TOOLTIP_WIDTH = 220;
const ESTIMATED_TOOLTIP_HEIGHT = 80;
const DOT_SIZE = 10;

type TooltipLayout = {
  position: TooltipPosition;
  offset: Offset;
  translation: Offset;
  padding: EdgeInsets;
};

function computePointTooltipLayout({
  pointX,
  pointY,
  plotWidth,
  plotHeight,
}: {
  pointX: number;
  pointY: number;
  plotWidth: number;
  plotHeight: number;
}): TooltipLayout {
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

// --- Toast tooltip area with hover dot + tooltip ---

class _ToastTooltipArea extends StatefulWidget {
  tooltip: Widget | null;
  hoveredPoint: { index: number; legend: string; x: number; y: number } | null;
  ctx: any;

  constructor({
    tooltip,
    hoveredPoint,
    ctx,
  }: {
    tooltip: Widget | null;
    hoveredPoint: { index: number; legend: string; x: number; y: number } | null;
    ctx: any;
  }) {
    super();
    this.tooltip = tooltip;
    this.hoveredPoint = hoveredPoint;
    this.ctx = ctx;
  }

  createState() {
    return new _ToastTooltipAreaState();
  }
}

class _ToastTooltipAreaState extends State<_ToastTooltipArea> {
  override build(): Widget {
    const { tooltip, hoveredPoint, ctx } = this.widget;
    const config: ToastLineChartConfig = ctx.config;

    if (hoveredPoint == null || tooltip == null || !config.tooltip.enabled) {
      return SizedBox.shrink();
    }

    const legendIdx = ctx.legends.indexOf(hoveredPoint.legend);
    const color = config.colors[legendIdx % config.colors.length];

    // Use renderObject size for tooltip layout computation
    const ro = this.element.renderObject;
    const size = ro.size;
    const layout = computePointTooltipLayout({
      pointX: hoveredPoint.x,
      pointY: hoveredPoint.y,
      plotWidth: size.width,
      plotHeight: size.height,
    });

    const dot = Container({
      width: DOT_SIZE,
      height: DOT_SIZE,
      decoration: new BoxDecoration({
        color,
        shape: "circle",
        border: Border.all({ color: "white", width: 2, strokeAlign: 1 }),
        boxShadow: [
          new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 6 }),
        ],
      }),
    });

    const tooltipWidget = ZIndex({
      zIndex: 9999,
      child: Padding({
        padding: layout.padding,
        child: tooltip,
      }),
    });

    return Positioned({
      key: "__dot__",
      left: hoveredPoint.x - DOT_SIZE / 2,
      top: hoveredPoint.y - DOT_SIZE / 2,
      child: Stack({
        fit: StackFit.passthrough,
        clipped: false,
        children: [
          dot,
          Positioned.fill({
            child: FractionalTranslation({
              translation: layout.offset,
              child: ConstraintsTransformBox({
                constraintsTransform: ConstraintsTransformBox.unconstrained,
                alignment: Alignment[layout.position],
                child: FractionalTranslation({
                  translation: layout.translation,
                  child: tooltipWidget,
                }),
              }),
            }),
          }),
        ],
      }),
    });
  }
}

export function toastTooltipArea(
  ...[args, ctx]: Parameters<LineChartCustom<ToastLineChartConfig>["tooltipArea"]>
) {
  const { tooltip, hoveredPoint } = args;
  return new _ToastTooltipArea({ tooltip, hoveredPoint, ctx });
}
