import {
  StatefulWidget,
  State,
  Container,
  Padding,
  EdgeInsets,
  BoxDecoration,
  Border,
  BoxShadow,
  GestureDetector,
  Tooltip,
  ZIndex,
  Offset,
  type Widget,
  type TooltipPosition,
} from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastStackedBarChartConfig } from "../config";
import { tooltipContent } from "@styles/toast";

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

// --- Case functions ---
// Naming: {direction}{sign}_{horizontal}_{vertical}

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

function verticalNegative_R_T(): TooltipLayout {
  return {
    position: "topRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function verticalNegative_R_B(): TooltipLayout {
  return {
    position: "bottomRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function verticalNegative_L_T(): TooltipLayout {
  return {
    position: "topLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function verticalNegative_L_B(): TooltipLayout {
  return {
    position: "bottomLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function horizontalPositive_R_T(): TooltipLayout {
  return {
    position: "topRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function horizontalPositive_R_B(): TooltipLayout {
  return {
    position: "bottomRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function horizontalPositive_L_T(): TooltipLayout {
  return {
    position: "topRight",
    translation: new Offset({ x: 0, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function horizontalPositive_L_B(): TooltipLayout {
  return {
    position: "bottomRight",
    translation: new Offset({ x: 0, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function horizontalNegative_L_T(): TooltipLayout {
  return {
    position: "topLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function horizontalNegative_L_B(): TooltipLayout {
  return {
    position: "bottomLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function horizontalNegative_R_T(): TooltipLayout {
  return {
    position: "topLeft",
    translation: new Offset({ x: 0, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function horizontalNegative_R_B(): TooltipLayout {
  return {
    position: "bottomLeft",
    translation: new Offset({ x: 0, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

// --- Dispatchers ---

function verticalPositive(space: SpaceAround, tooltipSize: TooltipSize): TooltipLayout {
  const fitsRight = space.right >= tooltipSize.width + TOOLTIP_GAP;
  const fitsBottom = space.bottom >= tooltipSize.height;
  if (fitsRight) {
    return fitsBottom ? verticalPositive_R_T() : verticalPositive_R_B();
  }
  return fitsBottom ? verticalPositive_L_T() : verticalPositive_L_B();
}

function verticalNegative(space: SpaceAround, tooltipSize: TooltipSize): TooltipLayout {
  const fitsRight = space.right >= tooltipSize.width + TOOLTIP_GAP;
  const fitsBottom = space.bottom >= tooltipSize.height;
  if (fitsRight) {
    return fitsBottom ? verticalNegative_R_T() : verticalNegative_R_B();
  }
  return fitsBottom ? verticalNegative_L_T() : verticalNegative_L_B();
}

function horizontalPositive(space: SpaceAround, tooltipSize: TooltipSize): TooltipLayout {
  const fitsRight = space.right >= tooltipSize.width + TOOLTIP_GAP;
  const fitsBottom = space.bottom >= tooltipSize.height;
  if (fitsRight) {
    return fitsBottom ? horizontalPositive_R_T() : horizontalPositive_R_B();
  }
  return fitsBottom ? horizontalPositive_L_T() : horizontalPositive_L_B();
}

function horizontalNegative(space: SpaceAround, tooltipSize: TooltipSize): TooltipLayout {
  const fitsLeft = space.left >= tooltipSize.width + TOOLTIP_GAP;
  const fitsBottom = space.bottom >= tooltipSize.height;
  if (fitsLeft) {
    return fitsBottom ? horizontalNegative_L_T() : horizontalNegative_L_B();
  }
  return fitsBottom ? horizontalNegative_R_T() : horizontalNegative_R_B();
}

// --- Router ---

function computeTooltipLayout({
  barGlobal,
  barSize,
  plotGlobal,
  direction,
  value,
  chartWidth,
  chartHeight,
}: {
  barGlobal: { x: number; y: number };
  barSize: { width: number; height: number };
  plotGlobal: { x: number; y: number };
  direction: "vertical" | "horizontal";
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

  if (direction === "vertical") {
    return value >= 0
      ? verticalPositive(space, tooltipSize)
      : verticalNegative(space, tooltipSize);
  }
  return value >= 0
    ? horizontalPositive(space, tooltipSize)
    : horizontalNegative(space, tooltipSize);
}

class _HoverableBar extends StatefulWidget {
  color: string;
  gap: number;
  tooltip: Widget;
  direction: "vertical" | "horizontal";
  value: number;
  chartWidth: number;
  chartHeight: number;

  constructor({
    color,
    gap,
    tooltip,
    direction,
    value,
    chartWidth,
    chartHeight,
  }: {
    color: string;
    gap: number;
    tooltip: Widget;
    direction: "vertical" | "horizontal";
    value: number;
    chartWidth: number;
    chartHeight: number;
  }) {
    super();
    this.color = color;
    this.gap = gap;
    this.tooltip = tooltip;
    this.direction = direction;
    this.value = value;
    this.chartWidth = chartWidth;
    this.chartHeight = chartHeight;
  }

  createState() {
    return new _HoverableBarState();
  }
}

class _HoverableBarState extends State<_HoverableBar> {
  hovered = false;
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
    const { direction, value, chartWidth, chartHeight } = this.widget;

    const plotGlobal = this.findPlotGlobal();
    if (!plotGlobal) return;

    this.tooltipLayout = computeTooltipLayout({
      barGlobal,
      barSize,
      plotGlobal,
      direction,
      value,
      chartWidth,
      chartHeight,
    });
  }

  override build() {
    const { color, gap, tooltip } = this.widget;

    const decoration = this.hovered
      ? new BoxDecoration({
        color,
        border: Border.all({ color: "white", width: 4, strokeAlign: 1 }),
        boxShadow: [
          new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 8 }),
        ],
      })
      : new BoxDecoration({ color });

    const layout = this.tooltipLayout;

    return Tooltip({
      position: layout?.position ?? "topRight",
      offset: layout?.offset ?? Offset.Constants.zero,
      translation: layout?.translation,
      tooltip: ZIndex({
        zIndex: 9999,
        child: Padding({
          padding: layout?.padding ?? EdgeInsets.only({ left: TOOLTIP_GAP }),
          child: tooltip,
        }),
      }),
      child: ZIndex({
        zIndex: this.hovered ? 1 : 0,
        child: GestureDetector({
          cursor: "default",
          child: Container({
            margin: EdgeInsets.symmetric({ horizontal: gap }),
            decoration,
          }),
          onMouseEnter: () => {
            this.computeLayout();
            this.setState(() => {
              this.hovered = true;
            });
          },
          onMouseLeave: () => {
            this.setState(() => {
              this.hovered = false;
            });
          },
        }),
      }),
    });
  }
}

export function toastBar(
  { legend, value, label, index }: { value: number; label: string; legend: string; index: number },
  context: BarChartContext<ToastStackedBarChartConfig>,
): Widget {
  const { colors, bar } = context.config;
  const idx = context.legends.indexOf(legend);
  const color = colors[idx % colors.length];

  if (!context.config.tooltip.enabled) {
    return Container({
      margin: EdgeInsets.symmetric({ horizontal: bar.gap }),
      decoration: new BoxDecoration({ color }),
    });
  }

  return new _HoverableBar({
    color,
    gap: bar.gap,
    tooltip: tooltipContent({ label, items: { legend, color, value }, config: context.config }),
    direction: context.direction,
    value,
    chartWidth: context.width,
    chartHeight: context.height,
  });
}
