import {
  StatefulWidget,
  State,
  Alignment,
  Align,
  AnimatedFractionallySizedBox,
  SizedBox,
  Stack,
  StackFit,
  ZIndex,
  Padding,
  EdgeInsets,
  Offset,
  type Widget,
  type TooltipPosition,
} from "flitter-core";
import Tooltip from "flitter-core/component/Tooltip";
import type { BoxPlotChartCustom } from "flitter-ui/chart";
import type { ToastBoxPlotChartConfig } from "../config";
import { tooltipContent } from "../../../_styles/toast/index";

const TOOLTIP_GAP = 4;
const ESTIMATED_TOOLTIP_WIDTH = 220;
const ESTIMATED_TOOLTIP_HEIGHT = 140;

type TooltipLayout = {
  position: TooltipPosition;
  offset: Offset;
  translation: Offset;
  padding: EdgeInsets;
};

type SpaceAround = { right: number; left: number; top: number; bottom: number };
type TooltipSize = { width: number; height: number };

function vertical_R_T(): TooltipLayout {
  return { position: "topRight", translation: new Offset({ x: 1, y: 0 }), offset: Offset.Constants.zero, padding: EdgeInsets.only({ left: TOOLTIP_GAP }) };
}
function vertical_R_B(): TooltipLayout {
  return { position: "bottomRight", translation: new Offset({ x: 1, y: 0 }), offset: Offset.Constants.zero, padding: EdgeInsets.only({ left: TOOLTIP_GAP }) };
}
function vertical_L_T(): TooltipLayout {
  return { position: "topLeft", translation: new Offset({ x: -1, y: 0 }), offset: Offset.Constants.zero, padding: EdgeInsets.only({ right: TOOLTIP_GAP }) };
}
function vertical_L_B(): TooltipLayout {
  return { position: "bottomLeft", translation: new Offset({ x: -1, y: 0 }), offset: Offset.Constants.zero, padding: EdgeInsets.only({ right: TOOLTIP_GAP }) };
}
function horizontal_R_T(): TooltipLayout {
  return { position: "topRight", translation: new Offset({ x: 1, y: 0 }), offset: Offset.Constants.zero, padding: EdgeInsets.only({ left: TOOLTIP_GAP }) };
}
function horizontal_R_B(): TooltipLayout {
  return { position: "bottomRight", translation: new Offset({ x: 1, y: 0 }), offset: Offset.Constants.zero, padding: EdgeInsets.only({ left: TOOLTIP_GAP }) };
}
function horizontal_L_T(): TooltipLayout {
  return { position: "topLeft", translation: new Offset({ x: -1, y: 0 }), offset: Offset.Constants.zero, padding: EdgeInsets.only({ right: TOOLTIP_GAP }) };
}
function horizontal_L_B(): TooltipLayout {
  return { position: "bottomLeft", translation: new Offset({ x: -1, y: 0 }), offset: Offset.Constants.zero, padding: EdgeInsets.only({ right: TOOLTIP_GAP }) };
}

function verticalDispatch(space: SpaceAround, ts: TooltipSize): TooltipLayout {
  const fitsRight = space.right >= ts.width + TOOLTIP_GAP;
  const fitsTop = space.top >= ts.height;
  if (fitsRight) return fitsTop ? vertical_R_T() : vertical_R_B();
  return fitsTop ? vertical_L_T() : vertical_L_B();
}

function horizontalDispatch(space: SpaceAround, ts: TooltipSize): TooltipLayout {
  const fitsRight = space.right >= ts.width + TOOLTIP_GAP;
  const fitsTop = space.top >= ts.height;
  if (fitsRight) return fitsTop ? horizontal_R_T() : horizontal_R_B();
  return fitsTop ? horizontal_L_T() : horizontal_L_B();
}

function computeTooltipLayout({
  boxGlobal, boxSize, plotGlobal, direction, chartWidth, chartHeight,
}: {
  boxGlobal: { x: number; y: number };
  boxSize: { width: number; height: number };
  plotGlobal: { x: number; y: number };
  direction: "vertical" | "horizontal";
  chartWidth: number;
  chartHeight: number;
}): TooltipLayout {
  const localX = boxGlobal.x - plotGlobal.x;
  const localY = boxGlobal.y - plotGlobal.y;
  const space: SpaceAround = {
    right: chartWidth - (localX + boxSize.width),
    left: localX,
    top: localY,
    bottom: chartHeight - (localY + boxSize.height),
  };
  const ts: TooltipSize = { width: ESTIMATED_TOOLTIP_WIDTH, height: ESTIMATED_TOOLTIP_HEIGHT };
  return direction === "vertical" ? verticalDispatch(space, ts) : horizontalDispatch(space, ts);
}

class _TooltipPositioner extends StatefulWidget {
  childWidget: Widget;
  tooltipWidget: Widget;
  direction: "vertical" | "horizontal";
  chartWidth: number;
  chartHeight: number;
  isHovered: boolean;

  constructor(props: {
    childWidget: Widget;
    tooltipWidget: Widget;
    direction: "vertical" | "horizontal";
    chartWidth: number;
    chartHeight: number;
    isHovered: boolean;
  }) {
    super();
    this.childWidget = props.childWidget;
    this.tooltipWidget = props.tooltipWidget;
    this.direction = props.direction;
    this.chartWidth = props.chartWidth;
    this.chartHeight = props.chartHeight;
    this.isHovered = props.isHovered;
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
      if (s && Math.abs(s.width - chartWidth) < 1 && Math.abs(s.height - chartHeight) < 1) {
        return node.localToGlobal();
      }
      node = node.parent;
    }
    return null;
  }

  private computeLayout() {
    const renderObject = this.element.renderObject;
    const boxGlobal = renderObject.localToGlobal();
    const boxSize = renderObject.size;
    const { direction, chartWidth, chartHeight } = this.widget;
    const plotGlobal = this.findPlotGlobal();
    if (!plotGlobal) return;
    this.tooltipLayout = computeTooltipLayout({ boxGlobal, boxSize, plotGlobal, direction, chartWidth, chartHeight });
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

function computeBoxAlignment(
  minRatio: number,
  maxRatio: number,
  isVertical: boolean,
): Alignment {
  const factor = maxRatio - minRatio;
  const denominator = 1 - factor;
  if (denominator <= 0) return Alignment.center;

  if (isVertical) {
    const y = (2 * (1 - maxRatio)) / denominator - 1;
    return new Alignment({ x: 0, y });
  } else {
    const x = (2 * minRatio) / denominator - 1;
    return new Alignment({ x, y: 0 });
  }
}

function outlierAlignment(ratio: number, isVertical: boolean): Alignment {
  if (isVertical) {
    return new Alignment({ x: 0, y: 1 - 2 * ratio });
  }
  return new Alignment({ x: 2 * ratio - 1, y: 0 });
}

export function toastBoxPlotBox(
  ...[{ boxPlot, outliers, minRatio, maxRatio, label, legend, isHovered, dataPoint }, ctx]: Parameters<
    BoxPlotChartCustom<ToastBoxPlotChartConfig>["boxPlotBox"]
  >
) {
  const isVertical = ctx.direction === "vertical";
  const factor = maxRatio - minRatio;
  const alignment = computeBoxAlignment(minRatio, maxRatio, isVertical);

  const stackWidget = Stack({
    fit: StackFit.expand,
    clipped: false,
    children: [
      AnimatedFractionallySizedBox({
        duration: ctx.config.animation.duration,
        alignment,
        heightFactor: isVertical ? factor : undefined,
        widthFactor: isVertical ? undefined : factor,
        child: boxPlot,
      }),
      ...outliers.map(({ widget, ratio }) =>
        Align({
          alignment: outlierAlignment(ratio, isVertical),
          child: widget,
        }),
      ),
    ],
  });

  if (!ctx.config.tooltip.enabled) {
    return stackWidget;
  }

  const { colors } = ctx.config;
  const color = colors[ctx.legends.indexOf(legend) % colors.length];

  const tooltipWidget = tooltipContent({
    label,
    items: [
      { legend: "max", color, value: dataPoint.max },
      { legend: "q3", color, value: dataPoint.q3 },
      { legend: "median", color, value: dataPoint.median },
      { legend: "q1", color, value: dataPoint.q1 },
      { legend: "min", color, value: dataPoint.min },
    ],
    config: ctx.config,
  });

  return new _TooltipPositioner({
    childWidget: stackWidget,
    tooltipWidget,
    direction: ctx.direction,
    chartWidth: ctx.width,
    chartHeight: ctx.height,
    isHovered,
  });
}
