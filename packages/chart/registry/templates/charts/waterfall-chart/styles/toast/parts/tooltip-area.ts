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
import type { WaterfallChartCustom } from "@headless/waterfall-chart/types";
import type { WaterfallChartConfig } from "../config";

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
  value,
  plotWidth,
  plotHeight,
}: {
  x: number;
  y: number;
  width: number;
  value: number;
  plotWidth: number;
  plotHeight: number;
}): TooltipLayout {
  const fitsRight = plotWidth - (x + width) >= ESTIMATED_TOOLTIP_WIDTH + TOOLTIP_GAP;
  const fitsTop = y >= ESTIMATED_TOOLTIP_HEIGHT;
  const isPositive = value >= 0;

  if (fitsRight) {
    return {
      position: fitsTop
        ? (isPositive ? "topRight" : "bottomRight")
        : (isPositive ? "bottomRight" : "topRight"),
      translation: new Offset({ x: 1, y: 0 }),
      offset: Offset.Constants.zero,
      padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
    };
  }

  return {
    position: fitsTop
      ? (isPositive ? "topLeft" : "bottomLeft")
      : (isPositive ? "bottomLeft" : "topLeft"),
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

class _ToastTooltipArea extends StatefulWidget {
  tooltip: Widget | null;
  hoveredBar: any;
  ctx: any;

  constructor({ tooltip, hoveredBar, ctx }: { tooltip: Widget | null; hoveredBar: any; ctx: any }) {
    super();
    this.tooltip = tooltip;
    this.hoveredBar = hoveredBar;
    this.ctx = ctx;
  }

  createState() {
    return new _ToastTooltipAreaState();
  }
}

class _ToastTooltipAreaState extends State<_ToastTooltipArea> {
  override build(): Widget {
    const { tooltip, hoveredBar, ctx } = this.widget;
    const config: WaterfallChartConfig = ctx.config;

    if (hoveredBar == null || tooltip == null || !config.tooltip.enabled) {
      return SizedBox.shrink();
    }

    const size = this.element.renderObject.size;
    const layout = computeTooltipLayout({
      x: hoveredBar.x,
      y: hoveredBar.y,
      width: hoveredBar.width,
      value: hoveredBar.item.value,
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
      left: hoveredBar.x,
      top: hoveredBar.y,
      child: Stack({
        fit: StackFit.passthrough,
        clipped: false,
        children: [
          SizedBox({ width: hoveredBar.width, height: hoveredBar.height }),
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
  ...[{ tooltip, hoveredBar }, ctx]: Parameters<WaterfallChartCustom<WaterfallChartConfig>["tooltipArea"]>
): Widget {
  return new _ToastTooltipArea({ tooltip, hoveredBar, ctx });
}
