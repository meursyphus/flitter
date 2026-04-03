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
import type { HistogramChartCustom } from "@headless/histogram-chart/types";
import type { HistogramChartConfig } from "../config";

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
  barX,
  barY,
  barWidth,
  plotWidth,
  plotHeight,
}: {
  barX: number;
  barY: number;
  barWidth: number;
  plotWidth: number;
  plotHeight: number;
}): TooltipLayout {
  const fitsRight = plotWidth - (barX + barWidth) >= ESTIMATED_TOOLTIP_WIDTH + TOOLTIP_GAP;
  const fitsTop = barY >= ESTIMATED_TOOLTIP_HEIGHT;

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
  hoveredBin: Parameters<HistogramChartCustom<HistogramChartConfig>["tooltipArea"]>[0]["hoveredBin"];
  ctx: any;

  constructor({
    tooltip,
    hoveredBin,
    ctx,
  }: {
    tooltip: Widget | null;
    hoveredBin: Parameters<HistogramChartCustom<HistogramChartConfig>["tooltipArea"]>[0]["hoveredBin"];
    ctx: any;
  }) {
    super();
    this.tooltip = tooltip;
    this.hoveredBin = hoveredBin;
    this.ctx = ctx;
  }

  createState() {
    return new _ToastTooltipAreaState();
  }
}

class _ToastTooltipAreaState extends State<_ToastTooltipArea> {
  override build(): Widget {
    const { tooltip, hoveredBin, ctx } = this.widget;
    const config: HistogramChartConfig = ctx.config;

    if (hoveredBin == null || tooltip == null || !config.tooltip.enabled) {
      return SizedBox.shrink();
    }

    const size = this.element.renderObject.size;
    const layout = computeTooltipLayout({
      barX: hoveredBin.x,
      barY: hoveredBin.y,
      barWidth: hoveredBin.width,
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
      left: hoveredBin.x,
      top: hoveredBin.y,
      child: Stack({
        fit: StackFit.passthrough,
        clipped: false,
        children: [
          SizedBox({ width: hoveredBin.width, height: hoveredBin.height }),
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
  ...[{ tooltip, hoveredBin }, ctx]: Parameters<HistogramChartCustom<HistogramChartConfig>["tooltipArea"]>
): Widget {
  return new _ToastTooltipArea({ tooltip, hoveredBin, ctx });
}
