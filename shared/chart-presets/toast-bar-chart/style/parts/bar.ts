import {
  StatefulWidget,
  State,
  Container,
  Padding,
  EdgeInsets,
  BoxDecoration,
  BorderRadius,
  Radius,
  Border,
  BoxShadow,
  GestureDetector,
  ZIndex,
  Offset,
  type Widget,
  type TooltipPosition,
} from "flitter-core";
import Tooltip from "flitter-core/component/Tooltip";
import type { BarChartContext } from "flitter-ui/chart";
import type { ToastBarChartConfig } from "../config";
import { tooltipContent } from "../../../_styles/toast/index";

function barBorderRadius(
  cornerRadius: number,
  direction: "vertical" | "horizontal",
  value: number,
) {
  if (cornerRadius === 0) return undefined;
  const r = Radius.circular(cornerRadius);
  const z = Radius.zero;

  if (direction === "vertical") {
    return value >= 0
      ? BorderRadius.only({ topLeft: r, topRight: r, bottomLeft: z, bottomRight: z })
      : BorderRadius.only({ topLeft: z, topRight: z, bottomLeft: r, bottomRight: r });
  }
  return value >= 0
    ? BorderRadius.only({ topLeft: z, topRight: r, bottomLeft: z, bottomRight: r })
    : BorderRadius.only({ topLeft: r, topRight: z, bottomLeft: r, bottomRight: z });
}

const TOOLTIP_GAP = 4;
const ESTIMATED_TOOLTIP_WIDTH = 220;
const ESTIMATED_TOOLTIP_HEIGHT = 80;

type TooltipLayout = {
  position: TooltipPosition;
  offset: Offset;
  translation: Offset;
  padding: EdgeInsets;
};

// --- Space & tooltip size types ---

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

// --- Case functions (each independently editable) ---
// Naming: {direction}{sign}_{horizontal}_{vertical}
//   horizontal: R(ight) / L(eft)
//   vertical:   T(op-aligned) / B(ottom-aligned)

function verticalPositive_R_T(): TooltipLayout {
  // Case V1-1a: vertical positive, fits right, top-aligned
  return {
    position: "topRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function verticalPositive_R_B(): TooltipLayout {
  // Case V1-1b: vertical positive, fits right, bottom-aligned
  return {
    position: "bottomRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function verticalPositive_L_T(): TooltipLayout {
  // Case V1-2a: vertical positive, no room right, top-aligned
  return {
    position: "topLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function verticalPositive_L_B(): TooltipLayout {
  // Case V1-2b: vertical positive, no room right, bottom-aligned
  return {
    position: "bottomLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function verticalNegative_R_T(): TooltipLayout {
  // Case V2-1a: vertical negative, fits right, top-aligned
  return {
    position: "topRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function verticalNegative_R_B(): TooltipLayout {
  // Case V2-1b: vertical negative, fits right, bottom-aligned
  return {
    position: "bottomRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function verticalNegative_L_T(): TooltipLayout {
  // Case V2-2a: vertical negative, no room right, top-aligned
  return {
    position: "topLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function verticalNegative_L_B(): TooltipLayout {
  // Case V2-2b: vertical negative, no room right, bottom-aligned
  return {
    position: "bottomLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function horizontalPositive_R_T(): TooltipLayout {
  // Case H1-1a: horizontal positive, fits right, top-aligned
  return {
    position: "topRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function horizontalPositive_R_B(): TooltipLayout {
  // Case H1-1b: horizontal positive, fits right, bottom-aligned
  return {
    position: "bottomRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function horizontalPositive_L_T(): TooltipLayout {
  // Case H1-2a: horizontal positive, no room right, top-aligned
  return {
    position: "topRight",
    translation: new Offset({ x: 0, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function horizontalPositive_L_B(): TooltipLayout {
  // Case H1-2b: horizontal positive, no room right, bottom-aligned
  return {
    position: "bottomRight",
    translation: new Offset({ x: 0, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function horizontalNegative_L_T(): TooltipLayout {
  // Case H2-1a: horizontal negative, fits left, top-aligned
  return {
    position: "topLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function horizontalNegative_L_B(): TooltipLayout {
  // Case H2-1b: horizontal negative, fits left, bottom-aligned
  return {
    position: "bottomLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function horizontalNegative_R_T(): TooltipLayout {
  // Case H2-2a: horizontal negative, no room left, top-aligned
  return {
    position: "topLeft",
    translation: new Offset({ x: 0, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function horizontalNegative_R_B(): TooltipLayout {
  // Case H2-2b: horizontal negative, no room left, bottom-aligned
  return {
    position: "bottomLeft",
    translation: new Offset({ x: 0, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

// --- Dispatchers (direction + sign -> horizontal + vertical check) ---

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

class _HoverableBar extends StatefulWidget {
  color: string;
  borderRadius: BorderRadius | undefined;
  gap: number;
  tooltip: Widget;
  direction: "vertical" | "horizontal";
  value: number;
  chartWidth: number;
  chartHeight: number;

  constructor({
    color,
    borderRadius,
    gap,
    tooltip,
    direction,
    value,
    chartWidth,
    chartHeight,
  }: {
    color: string;
    borderRadius: BorderRadius | undefined;
    gap: number;
    tooltip: Widget;
    direction: "vertical" | "horizontal";
    value: number;
    chartWidth: number;
    chartHeight: number;
  }) {
    super();
    this.color = color;
    this.borderRadius = borderRadius;
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
    const { color, borderRadius, gap, tooltip } = this.widget;

    const decoration = this.hovered
      ? new BoxDecoration({
        color,
        borderRadius,
        border: Border.all({ color: "white", width: 4, strokeAlign: 1 }),
        boxShadow: [
          new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 8 }),
        ],
      })
      : new BoxDecoration({ color, borderRadius });

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
    });
  }
}

export function toastBar(
  { legend, value, label, index }: { value: number; label: string; legend: string; index: number },
  context: BarChartContext<ToastBarChartConfig>,
): Widget {
  const { colors, bar } = context.config;
  const idx = context.legends.indexOf(legend);
  const color = colors[idx % colors.length];
  const borderRadius = barBorderRadius(bar.cornerRadius, context.direction, value);

  if (!context.config.tooltip.enabled) {
    return Container({
      margin: EdgeInsets.symmetric({ horizontal: bar.gap }),
      decoration: new BoxDecoration({ color, borderRadius }),
    });
  }

  return new _HoverableBar({
    color,
    borderRadius,
    gap: bar.gap,
    tooltip: tooltipContent({ label, items: { legend, color, value }, config: context.config }),
    direction: context.direction,
    value,
    chartWidth: context.width,
    chartHeight: context.height,
  });
}
