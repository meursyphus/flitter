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
import type { BoxPlotChartCustom } from "@headless/box-plot-chart/types";
import type { ToastBoxPlotChartConfig } from "../config";

const TOOLTIP_GAP = 4;
const ESTIMATED_TOOLTIP_WIDTH = 220;
const ESTIMATED_TOOLTIP_HEIGHT = 80;

type TooltipLayout = {
  position: TooltipPosition;
  translation: Offset;
  padding: EdgeInsets;
};

function computeTooltipLayout({
  x,
  y,
  width,
  kind,
  plotWidth,
}: {
  x: number;
  y: number;
  width: number;
  kind: "boxPlot" | "outlier";
  plotWidth: number;
}): TooltipLayout {
  if (kind === "outlier") {
    return {
      position: "topCenter",
      translation: new Offset({ x: -0.5, y: -1 }),
      padding: EdgeInsets.only({ bottom: TOOLTIP_GAP }),
    };
  }

  const fitsRight = plotWidth - (x + width) >= ESTIMATED_TOOLTIP_WIDTH + TOOLTIP_GAP;
  if (fitsRight) {
    return {
      position: "topRight",
      translation: new Offset({ x: 1, y: 0 }),
      padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
    };
  }

  return {
    position: "topLeft",
    translation: new Offset({ x: -1, y: 0 }),
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

class _ToastTooltipArea extends StatefulWidget {
  tooltip: Widget | null;
  hoveredBoxPlot: any;
  ctx: any;

  constructor({ tooltip, hoveredBoxPlot, ctx }: { tooltip: Widget | null; hoveredBoxPlot: any; ctx: any }) {
    super();
    this.tooltip = tooltip;
    this.hoveredBoxPlot = hoveredBoxPlot;
    this.ctx = ctx;
  }

  createState() {
    return new _ToastTooltipAreaState();
  }
}

class _ToastTooltipAreaState extends State<_ToastTooltipArea> {
  override build(): Widget {
    const { tooltip, hoveredBoxPlot, ctx } = this.widget;
    const config: ToastBoxPlotChartConfig = ctx.config;

    if (hoveredBoxPlot == null || tooltip == null || !config.tooltip.enabled) {
      return SizedBox.shrink();
    }

    const size = this.element.renderObject.size;
    const layout = computeTooltipLayout({
      x: hoveredBoxPlot.x,
      y: hoveredBoxPlot.y,
      width: hoveredBoxPlot.width,
      kind: hoveredBoxPlot.kind,
      plotWidth: size.width,
    });

    const tooltipWidget = ZIndex({
      zIndex: 9999,
      child: Padding({
        padding: layout.padding,
        child: tooltip,
      }),
    });

    const left =
      hoveredBoxPlot.kind === "outlier"
        ? hoveredBoxPlot.x + hoveredBoxPlot.width / 2
        : hoveredBoxPlot.x;

    return Positioned({
      key: "__tooltip__",
      left,
      top: hoveredBoxPlot.y,
      child: Stack({
        fit: StackFit.passthrough,
        clipped: false,
        children: [
          SizedBox({ width: hoveredBoxPlot.width, height: hoveredBoxPlot.height }),
          Positioned.fill({
            child: ConstraintsTransformBox({
              constraintsTransform: ConstraintsTransformBox.unconstrained,
              alignment: Alignment[layout.position],
              child: FractionalTranslation({
                translation: layout.translation,
                child: tooltipWidget,
              }),
            }),
          }),
        ],
      }),
    });
  }
}

export function toastTooltipArea(
  ...[{ tooltip, hoveredBoxPlot }, ctx]: Parameters<BoxPlotChartCustom<ToastBoxPlotChartConfig>["tooltipArea"]>
): Widget {
  return new _ToastTooltipArea({ tooltip, hoveredBoxPlot, ctx });
}
