import {
  StatefulWidget,
  State,
  SizedBox,
  Stack,
  StackFit,
  Positioned,
  ZIndex,
  Padding,
  FractionalTranslation,
  ConstraintsTransformBox,
  Alignment,
  EdgeInsets,
  Offset,
  type Widget,
  type TooltipPosition,
} from "flitter-core";
import type { CandlestickChartCustom } from "@headless/candlestick-chart/types";
import type { CandlestickChartConfig } from "../config";

const TOOLTIP_GAP = 4;
const ESTIMATED_TOOLTIP_WIDTH = 220;
const ESTIMATED_TOOLTIP_HEIGHT = 80;

type TooltipLayout = {
  position: TooltipPosition;
  offset: Offset;
  translation: Offset;
  padding: EdgeInsets;
};

function computeTooltipLayout({
  x,
  y,
  width,
  plotWidth,
  plotHeight,
}: {
  x: number;
  y: number;
  width: number;
  plotWidth: number;
  plotHeight: number;
}): TooltipLayout {
  const fitsRight = plotWidth - (x + width) >= ESTIMATED_TOOLTIP_WIDTH + TOOLTIP_GAP;
  const fitsTop = y >= ESTIMATED_TOOLTIP_HEIGHT;

  if (fitsRight) {
    return {
      position: fitsTop ? "topRight" : "bottomRight",
      translation: new Offset({ x: 1, y: 0 }),
      offset: Offset.Constants.zero,
      padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
    };
  }

  return {
    position: fitsTop ? "topLeft" : "bottomLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

class _ToastTooltipArea extends StatefulWidget {
  tooltip: Widget | null;
  hoveredCandlestick: {
    index: number;
    candle: any;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  ctx: any;

  constructor({
    tooltip,
    hoveredCandlestick,
    ctx,
  }: {
    tooltip: Widget | null;
    hoveredCandlestick: {
      index: number;
      candle: any;
      x: number;
      y: number;
      width: number;
      height: number;
    } | null;
    ctx: any;
  }) {
    super();
    this.tooltip = tooltip;
    this.hoveredCandlestick = hoveredCandlestick;
    this.ctx = ctx;
  }

  createState() {
    return new _ToastTooltipAreaState();
  }
}

class _ToastTooltipAreaState extends State<_ToastTooltipArea> {
  override build(): Widget {
    const { tooltip, hoveredCandlestick, ctx } = this.widget;
    const config: CandlestickChartConfig = ctx.config;

    if (hoveredCandlestick == null || tooltip == null || !config.tooltip.enabled) {
      return SizedBox.shrink();
    }

    const size = this.element.renderObject.size;
    const layout = computeTooltipLayout({
      x: hoveredCandlestick.x,
      y: hoveredCandlestick.y,
      width: hoveredCandlestick.width,
      plotWidth: size.width,
      plotHeight: size.height,
    });

    const tooltipWidget = ZIndex({
      zIndex: 9999,
      child: Padding({
        padding: layout.padding,
        child: tooltip,
      }),
    });

    return Positioned({
      key: "__tooltip__",
      left: hoveredCandlestick.x,
      top: hoveredCandlestick.y,
      child: Stack({
        fit: StackFit.passthrough,
        clipped: false,
        children: [
          SizedBox({ width: hoveredCandlestick.width, height: hoveredCandlestick.height }),
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
  ...[{ tooltip, hoveredCandlestick }, ctx]: Parameters<CandlestickChartCustom<CandlestickChartConfig>["tooltipArea"]>
): Widget {
  return new _ToastTooltipArea({ tooltip, hoveredCandlestick, ctx });
}
