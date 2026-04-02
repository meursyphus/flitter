import {
  StatefulWidget,
  State,
  Alignment,
  Border,
  BoxDecoration,
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  Flexible,
  FractionallySizedBox,
  MainAxisSize,
  Offset,
  Opacity,
  Padding,
  SizedBox,
  Text,
  TextStyle,
  ZIndex,
  type Widget,
  type TooltipPosition,
} from "flitter-core";
import Tooltip from "flitter-core/component/Tooltip";
import type { WaterfallBarType, WaterfallChartContext } from "flitter-ui/chart";
import type { WaterfallChartConfig } from "../config";
import { agTooltipContent } from "../../../_styles/ag/index";

const TYPE_INDEX: Record<WaterfallBarType, number> = {
  increase: 0,
  decrease: 1,
  total: 2,
  subtotal: 2,
};

const TYPE_LABEL: Record<WaterfallBarType, string> = {
  increase: "Increase",
  decrease: "Decrease",
  total: "Total",
  subtotal: "Subtotal",
};

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

function positive_R_T(): TooltipLayout {
  return {
    position: "topRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function positive_R_B(): TooltipLayout {
  return {
    position: "bottomRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function positive_L_T(): TooltipLayout {
  return {
    position: "topLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function positive_L_B(): TooltipLayout {
  return {
    position: "bottomLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function negative_R_T(): TooltipLayout {
  return {
    position: "topRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function negative_R_B(): TooltipLayout {
  return {
    position: "bottomRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function negative_L_T(): TooltipLayout {
  return {
    position: "topLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function negative_L_B(): TooltipLayout {
  return {
    position: "bottomLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function positiveLayout(space: SpaceAround, tooltipSize: TooltipSize): TooltipLayout {
  const fitsRight = space.right >= tooltipSize.width + TOOLTIP_GAP;
  const fitsTop = space.top >= tooltipSize.height;
  if (fitsRight) {
    return fitsTop ? positive_R_T() : positive_R_B();
  }
  return fitsTop ? positive_L_T() : positive_L_B();
}

function negativeLayout(space: SpaceAround, tooltipSize: TooltipSize): TooltipLayout {
  const fitsRight = space.right >= tooltipSize.width + TOOLTIP_GAP;
  const fitsTop = space.top >= tooltipSize.height;
  if (fitsRight) {
    return fitsTop ? negative_R_T() : negative_R_B();
  }
  return fitsTop ? negative_L_T() : negative_L_B();
}

function computeTooltipLayout({
  barGlobal,
  barSize,
  plotGlobal,
  value,
  chartWidth,
  chartHeight,
}: {
  barGlobal: { x: number; y: number };
  barSize: { width: number; height: number };
  plotGlobal: { x: number; y: number };
  value: number;
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

  return value >= 0
    ? positiveLayout(space, tooltipSize)
    : negativeLayout(space, tooltipSize);
}

class _TooltipPositioner extends StatefulWidget {
  barWidget: Widget;
  tooltipWidget: Widget;
  value: number;
  chartWidth: number;
  chartHeight: number;
  isHovered: boolean;

  constructor({
    barWidget,
    tooltipWidget,
    value,
    chartWidth,
    chartHeight,
    isHovered,
  }: {
    barWidget: Widget;
    tooltipWidget: Widget;
    value: number;
    chartWidth: number;
    chartHeight: number;
    isHovered: boolean;
  }) {
    super();
    this.barWidget = barWidget;
    this.tooltipWidget = tooltipWidget;
    this.value = value;
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
    const { value, chartWidth, chartHeight } = this.widget;

    const plotGlobal = this.findPlotGlobal();
    if (!plotGlobal) return;

    this.tooltipLayout = computeTooltipLayout({
      barGlobal,
      barSize,
      plotGlobal,
      value,
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

export function agBar(
  { value, cumulative, index, label, type, isHovered }: {
    value: number;
    cumulative: number;
    index: number;
    label: string;
    type: WaterfallBarType;
    isHovered: boolean;
  },
  ctx: WaterfallChartContext<WaterfallChartConfig>,
): Widget {
  const scale = ctx.scale;
  if (scale == null) return SizedBox.shrink();

  const total = scale.max - scale.min || 1;
  const barBase =
    type === "total"
      ? 0
      : value >= 0
        ? cumulative - value
        : cumulative;
  const barTop = type === "total" ? cumulative : barBase + value;
  const minValue = Math.min(barBase, barTop);
  const maxValue = Math.max(barBase, barTop);
  const heightRatio = (maxValue - minValue) / total;
  const bottomRatio = (minValue - scale.min) / total;
  const outerHeightFactor = Math.max(0, Math.min(1, bottomRatio + heightRatio));
  const innerHeightFactor =
    outerHeightFactor > 0 ? Math.max(0, Math.min(1, heightRatio / outerHeightFactor)) : 0;
  const color = ctx.config.colors.fills[TYPE_INDEX[type]] ?? ctx.config.colors.fills[0];
  const hoveredBar = ctx.hoveredBar;
  const activeOpacity = hoveredBar == null || isHovered ? 1 : 0.35;
  const dlCfg = ctx.config.waterfall.dataLabel;
  const isPositive = value >= 0;
  const formattedValue = (isPositive ? "+" : "") + value.toLocaleString();

  const dataLabelWidget = dlCfg.visible
    ? Padding({
        padding: EdgeInsets.only({ bottom: isPositive ? 2 : 0, top: isPositive ? 0 : 2 }),
        child: Text(formattedValue, {
          style: new TextStyle({
            fontSize: dlCfg.fontSize,
            color: dlCfg.color,
            fontFamily: dlCfg.fontFamily ?? ctx.config.font.family,
          }),
        }),
      })
    : SizedBox.shrink();

  const barWidget = Opacity({
    opacity: activeOpacity,
    child: Container({
      width: Infinity,
      height: Infinity,
      alignment: Alignment.bottomCenter,
      child:
        outerHeightFactor <= 0
          ? SizedBox.shrink()
          : FractionallySizedBox({
              heightFactor: outerHeightFactor,
              alignment: Alignment.bottomCenter,
              child: Column({
                mainAxisSize: MainAxisSize.max,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  ...(isPositive && dlCfg.visible
                    ? [dataLabelWidget]
                    : []),
                  Flexible({
                    child: FractionallySizedBox({
                      heightFactor: innerHeightFactor,
                      alignment: Alignment.topCenter,
                      child: Padding({
                        padding: EdgeInsets.symmetric({
                          horizontal: Math.max(2, ctx.config.waterfall.barGap / 2),
                        }),
                        child: Container({
                          width: Infinity,
                          height: Infinity,
                          decoration: new BoxDecoration({
                            color,
                            border:
                              isHovered
                                ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                                : undefined,
                          }),
                        }),
                      }),
                    }),
                  }),
                  ...(!isPositive && dlCfg.visible
                    ? [dataLabelWidget]
                    : []),
                ],
              }),
            }),
    }),
  });

  if (!ctx.config.tooltip.enabled) {
    return barWidget;
  }

  const tooltipWidget = agTooltipContent({
    label,
    items: [
      { legend: TYPE_LABEL[type], color, value },
      { legend: "Cumulative", color: ctx.config.axis.color, value: cumulative },
    ],
    config: ctx.config as any,
  });

  return new _TooltipPositioner({
    barWidget,
    tooltipWidget,
    value,
    chartWidth: ctx.width,
    chartHeight: ctx.height,
    isHovered,
  });
}
