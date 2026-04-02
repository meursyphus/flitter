import {
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
import type { BarChartCustom } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "../config";

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

// --- Case functions (each independently editable) ---
// Naming: {direction}{sign}_{horizontal}_{vertical}
//   horizontal: R(ight) / L(eft)
//   vertical:   T(op-aligned) / B(ottom-aligned)

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
  barX,
  barY,
  barWidth,
  barHeight,
  direction,
  value,
  chartWidth,
  chartHeight,
}: {
  barX: number;
  barY: number;
  barWidth: number;
  barHeight: number;
  direction: "vertical" | "horizontal";
  value: number;
  chartWidth: number;
  chartHeight: number;
}): TooltipLayout {
  const space: SpaceAround = {
    right: chartWidth - (barX + barWidth),
    left: barX,
    top: barY,
    bottom: chartHeight - (barY + barHeight),
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

export function toastTooltipArea(
  ...[{ tooltip, hoveredBar }, ctx]: Parameters<BarChartCustom<ToastBarChartConfig>['tooltipArea']>
): Widget {
  const { direction, config } = ctx;

  if (!hoveredBar || !tooltip || !config.tooltip.enabled) {
    return SizedBox.shrink();
  }

  const layout = computeTooltipLayout({
    barX: hoveredBar.x,
    barY: hoveredBar.y,
    barWidth: hoveredBar.width,
    barHeight: hoveredBar.height,
    direction,
    value: hoveredBar.value,
    chartWidth: ctx.width,
    chartHeight: ctx.height,
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
