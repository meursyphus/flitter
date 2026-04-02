import {
  StatefulWidget,
  State,
  Alignment,
  Border,
  BoxDecoration,
  BoxShadow,
  Container,
  EdgeInsets,
  FractionallySizedBox,
  Offset,
  Padding,
  ZIndex,
  type Widget,
  type TooltipPosition,
} from "flitter-core";
import Tooltip from "flitter-core/component/Tooltip";
import type { HistogramChartCustom, HistogramChartContext } from "flitter-ui/chart";
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

type SpaceAround = {
  right: number;
  left: number;
  top: number;
  bottom: number;
};

type TooltipSize = {
  width: number;
  height: number;
};

function verticalPositive_R_T(): TooltipLayout {
  return {
    position: "topRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function verticalPositive_R_B(): TooltipLayout {
  return {
    position: "bottomRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function verticalPositive_L_T(): TooltipLayout {
  return {
    position: "topLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function verticalPositive_L_B(): TooltipLayout {
  return {
    position: "bottomLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function computeTooltipLayout({
  barGlobal,
  barSize,
  plotGlobal,
  chartWidth,
  chartHeight,
}: {
  barGlobal: { x: number; y: number };
  barSize: { width: number; height: number };
  plotGlobal: { x: number; y: number };
  chartWidth: number;
  chartHeight: number;
}): TooltipLayout {
  const barLocalX = barGlobal.x - plotGlobal.x;
  const barLocalY = barGlobal.y - plotGlobal.y;
  const space: SpaceAround = {
    right: chartWidth - (barLocalX + barSize.width),
    left: barLocalX,
    top: barLocalY,
    bottom: chartHeight - (barLocalY + barSize.height),
  };

  const tooltipSize: TooltipSize = {
    width: ESTIMATED_TOOLTIP_WIDTH,
    height: ESTIMATED_TOOLTIP_HEIGHT,
  };

  const fitsRight = space.right >= tooltipSize.width + TOOLTIP_GAP;
  const fitsTop = space.top >= tooltipSize.height;
  if (fitsRight) {
    return fitsTop ? verticalPositive_R_T() : verticalPositive_R_B();
  }
  return fitsTop ? verticalPositive_L_T() : verticalPositive_L_B();
}

class _TooltipPositioner extends StatefulWidget {
  barWidget: Widget;
  tooltipWidget: Widget;
  chartWidth: number;
  chartHeight: number;
  isHovered: boolean;

  constructor({
    barWidget,
    tooltipWidget,
    chartWidth,
    chartHeight,
    isHovered,
  }: {
    barWidget: Widget;
    tooltipWidget: Widget;
    chartWidth: number;
    chartHeight: number;
    isHovered: boolean;
  }) {
    super();
    this.barWidget = barWidget;
    this.tooltipWidget = tooltipWidget;
    this.chartWidth = chartWidth;
    this.chartHeight = chartHeight;
    this.isHovered = isHovered;
  }

  createState() {
    return new _TooltipPositionerState();
  }
}

class _TooltipPositionerState extends State<_TooltipPositioner> {
  tooltipLayout: TooltipLayout | null = null;

  private findPlotGlobal(): { x: number; y: number } | null {
    const { chartWidth, chartHeight } = this.widget;
    let node = this.element.renderObject.parent;
    while (node) {
      const s = node.size;
      if (
        s &&
        Math.abs(s.width - chartWidth) < 1 &&
        Math.abs(s.height - chartHeight) < 1
      ) {
        return node.localToGlobal();
      }
      node = node.parent;
    }
    return null;
  }

  private computeLayout() {
    const renderObject = this.element.renderObject;
    const barGlobal = renderObject.localToGlobal();
    const barSize = renderObject.size;
    const { chartWidth, chartHeight } = this.widget;

    const plotGlobal = this.findPlotGlobal();
    if (!plotGlobal) return;

    this.tooltipLayout = computeTooltipLayout({
      barGlobal,
      barSize,
      plotGlobal,
      chartWidth,
      chartHeight,
    });
  }

  override build() {
    const { isHovered, tooltipWidget } = this.widget;

    if (isHovered) {
      this.computeLayout();
    }

    const layout = this.tooltipLayout;

    if (!isHovered) {
      return this.widget.barWidget;
    }

    return Tooltip({
      position: layout?.position ?? "topRight",
      offset: layout?.offset ?? Offset.Constants.zero,
      translation: layout?.translation,
      tooltip: ZIndex({
        zIndex: 9999,
        child: Padding({
          padding: layout?.padding ?? EdgeInsets.only({ left: TOOLTIP_GAP }),
          child: tooltipWidget,
        }),
      }),
      child: this.widget.barWidget,
    });
  }
}

export function toastBar(
  ...[{ binMin, binMax, count, index, isHovered }, ctx]: Parameters<HistogramChartCustom<HistogramChartConfig>["bar"]>
): Widget {
  const scale = ctx.scale;
  const ratio =
    scale && scale.max > scale.min ? (count - scale.min) / (scale.max - scale.min) : 0;
  const color = ctx.config.colors[0];

  const barWidget = Container({
    width: Infinity,
    height: Infinity,
    alignment: Alignment.bottomCenter,
    child: FractionallySizedBox({
      heightFactor: Math.max(0, Math.min(1, ratio)),
      child: Container({
        width: Infinity,
        height: Infinity,
        decoration: new BoxDecoration({
          color,
          border: isHovered
            ? Border.all({ color: "white", width: 3, strokeAlign: 1 })
            : undefined,
          boxShadow: isHovered
            ? [new BoxShadow({ color: "rgba(0,0,0,0.22)", blurRadius: 10 })]
            : undefined,
        }),
      }),
    }),
  });

  if (!ctx.config.tooltip.enabled) {
    return barWidget;
  }

  const tooltipWidget = ctx.custom.tooltip(
    {
      label: `${binMin} - ${binMax}`,
      items: [{ legend: "Count", color, value: count }],
    },
    ctx,
  );

  return new _TooltipPositioner({
    barWidget,
    tooltipWidget,
    chartWidth: ctx.width,
    chartHeight: ctx.height,
    isHovered,
  });
}
