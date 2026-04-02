import {
  StatefulWidget,
  State,
  AnimatedFractionallySizedBox,
  SizedBox,
  Padding,
  EdgeInsets,
  ZIndex,
  Offset,
  type Widget,
  type TooltipPosition,
} from "flitter-core";
import Tooltip from "flitter-core/component/Tooltip";
import type { BarChartCustom, BarChartContext } from "@headless/bar-chart/types";
import type { ToastStackedBarChartConfig } from "../config";

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
  const fitsTop = space.top >= tooltipSize.height;
  if (fitsRight) {
    return fitsTop ? verticalPositive_R_T() : verticalPositive_R_B();
  }
  return fitsTop ? verticalPositive_L_T() : verticalPositive_L_B();
}

function verticalNegative(space: SpaceAround, tooltipSize: TooltipSize): TooltipLayout {
  const fitsRight = space.right >= tooltipSize.width + TOOLTIP_GAP;
  const fitsTop = space.top >= tooltipSize.height;
  if (fitsRight) {
    return fitsTop ? verticalNegative_R_T() : verticalNegative_R_B();
  }
  return fitsTop ? verticalNegative_L_T() : verticalNegative_L_B();
}

function horizontalPositive(space: SpaceAround, tooltipSize: TooltipSize): TooltipLayout {
  const fitsRight = space.right >= tooltipSize.width + TOOLTIP_GAP;
  const fitsTop = space.top >= tooltipSize.height;
  if (fitsRight) {
    return fitsTop ? horizontalPositive_R_T() : horizontalPositive_R_B();
  }
  return fitsTop ? horizontalPositive_L_T() : horizontalPositive_L_B();
}

function horizontalNegative(space: SpaceAround, tooltipSize: TooltipSize): TooltipLayout {
  const fitsLeft = space.left >= tooltipSize.width + TOOLTIP_GAP;
  const fitsTop = space.top >= tooltipSize.height;
  if (fitsLeft) {
    return fitsTop ? horizontalNegative_L_T() : horizontalNegative_L_B();
  }
  return fitsTop ? horizontalNegative_R_T() : horizontalNegative_R_B();
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

/**
 * Lightweight StatefulWidget solely for tooltip positioning.
 * Hover state is managed by headless; this only computes layout
 * when isHovered becomes true.
 */
class _TooltipPositioner extends StatefulWidget {
  childWidget: Widget;
  tooltipWidget: Widget;
  direction: "vertical" | "horizontal";
  value: number;
  chartWidth: number;
  chartHeight: number;
  isHovered: boolean;

  constructor({
    childWidget,
    tooltipWidget,
    direction,
    value,
    chartWidth,
    chartHeight,
    isHovered,
  }: {
    childWidget: Widget;
    tooltipWidget: Widget;
    direction: "vertical" | "horizontal";
    value: number;
    chartWidth: number;
    chartHeight: number;
    isHovered: boolean;
  }) {
    super();
    this.childWidget = childWidget;
    this.tooltipWidget = tooltipWidget;
    this.direction = direction;
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
    const { isHovered, tooltipWidget } = this.widget;

    if (isHovered) {
      this.computeLayout();
    }

    const layout = this.tooltipLayout;

    return Tooltip({
      position: layout?.position ?? "topRight",
      offset: layout?.offset ?? Offset.Constants.zero,
      translation: layout?.translation,
      tooltip: isHovered
        ? ZIndex({
            zIndex: 9999,
            child: Padding({
              padding: layout?.padding ?? EdgeInsets.only({ left: TOOLTIP_GAP }),
              child: tooltipWidget,
            }),
          })
        : SizedBox.shrink(),
      child: this.widget.childWidget,
    });
  }
}

export function toastBarBox(
  ...[{ bar, ratio, alignment, value, label, legend, isHovered }, ctx]: Parameters<BarChartCustom<ToastStackedBarChartConfig>['barBox']>
) {
  const { direction, config } = ctx;
  const isVertical = direction === "vertical";

  const idx = ctx.legends.indexOf(legend);
  const color = config.colors[idx % config.colors.length];

  const boxChild = AnimatedFractionallySizedBox({
    duration: config.animation.duration,
    alignment,
    widthFactor: isVertical ? undefined : ratio,
    heightFactor: isVertical ? ratio : undefined,
    child: Padding({
      padding: EdgeInsets.symmetric(
        isVertical ? { horizontal: 2 } : { vertical: 2 }
      ),
      child: bar,
    }),
  });

  if (!config.tooltip.enabled) {
    return boxChild;
  }

  const tooltipWidget = ctx.custom.tooltip(
    { label, items: [{ legend, color, value }] },
    ctx,
  );

  return new _TooltipPositioner({
    childWidget: boxChild,
    tooltipWidget,
    direction,
    value,
    chartWidth: ctx.width,
    chartHeight: ctx.height,
    isHovered,
  });
}
