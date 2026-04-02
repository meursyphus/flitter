import {
  StatefulWidget,
  State,
  Container,
  Column,
  Row,
  CrossAxisAlignment,
  Flexible,
  SizedBox,
  GestureDetector,
  EdgeInsets,
  BoxDecoration,
  Border,
  BoxShadow,
  ZIndex,
  Offset,
  Padding,
  type Widget,
  type TooltipPosition,
} from "flitter-core";
import Tooltip from "flitter-core/component/Tooltip";
import type { BoxPlotChartCustom, BoxPlotDataPoint } from "flitter-ui/chart";
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

class _HoverableBoxPlot extends StatefulWidget {
  boxColor: string;
  whiskerColor: string;
  boxWidth: number;
  whiskerWidth: number;
  gap: number;
  dataPoint: BoxPlotDataPoint;
  tooltip: Widget;
  direction: "vertical" | "horizontal";
  chartWidth: number;
  chartHeight: number;
  isHovered: boolean;
  onHover: () => void;
  onUnhover: () => void;

  constructor(props: {
    boxColor: string;
    whiskerColor: string;
    boxWidth: number;
    whiskerWidth: number;
    gap: number;
    dataPoint: BoxPlotDataPoint;
    tooltip: Widget;
    direction: "vertical" | "horizontal";
    chartWidth: number;
    chartHeight: number;
    isHovered: boolean;
    onHover: () => void;
    onUnhover: () => void;
  }) {
    super();
    this.boxColor = props.boxColor;
    this.whiskerColor = props.whiskerColor;
    this.boxWidth = props.boxWidth;
    this.whiskerWidth = props.whiskerWidth;
    this.gap = props.gap;
    this.dataPoint = props.dataPoint;
    this.tooltip = props.tooltip;
    this.direction = props.direction;
    this.chartWidth = props.chartWidth;
    this.chartHeight = props.chartHeight;
    this.isHovered = props.isHovered;
    this.onHover = props.onHover;
    this.onUnhover = props.onUnhover;
  }

  createState() {
    return new _HoverableBoxPlotState();
  }
}

class _HoverableBoxPlotState extends State<_HoverableBoxPlot> {
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
    const { boxColor, whiskerColor, boxWidth, whiskerWidth, gap, dataPoint, tooltip, isHovered } = this.widget;
    const isVertical = this.widget.direction === "vertical";

    const range = dataPoint.max - dataPoint.min || 1;
    const minToQ1 = (dataPoint.q1 - dataPoint.min) / range;
    const q1ToMedian = (dataPoint.median - dataPoint.q1) / range;
    const medianToQ3 = (dataPoint.q3 - dataPoint.median) / range;
    const q3ToMax = (dataPoint.max - dataPoint.q3) / range;

    const decoration = isHovered
      ? new BoxDecoration({
          color: boxColor,
          border: Border.all({ color: "white", width: 4, strokeAlign: 1 }),
          boxShadow: [new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 8 })],
        })
      : new BoxDecoration({ color: boxColor });

    const buildSection = (flex: number, child: Widget) =>
      flex > 0 ? [Flexible({ flex, child })] : [];

    const sections: Widget[] = isVertical
      ? [
          Container({ width: whiskerWidth, height: 1, color: whiskerColor }),
          ...buildSection(q3ToMax, Container({ width: isHovered ? 2 : 1, color: whiskerColor, height: Infinity })),
          ...buildSection(medianToQ3, Container({ width: boxWidth, height: Infinity, decoration })),
          Container({ width: boxWidth, height: 2, color: "white" }),
          ...buildSection(q1ToMedian, Container({ width: boxWidth, height: Infinity, decoration })),
          ...buildSection(minToQ1, Container({ width: isHovered ? 2 : 1, color: whiskerColor, height: Infinity })),
          Container({ width: whiskerWidth, height: 1, color: whiskerColor }),
        ]
      : [
          Container({ width: 1, height: whiskerWidth, color: whiskerColor }),
          ...buildSection(minToQ1, Container({ width: Infinity, height: isHovered ? 2 : 1, color: whiskerColor })),
          ...buildSection(q1ToMedian, Container({ height: boxWidth, width: Infinity, decoration })),
          Container({ width: 2, height: boxWidth, color: "white" }),
          ...buildSection(medianToQ3, Container({ height: boxWidth, width: Infinity, decoration })),
          ...buildSection(q3ToMax, Container({ width: Infinity, height: isHovered ? 2 : 1, color: whiskerColor })),
          Container({ width: 1, height: whiskerWidth, color: whiskerColor }),
        ];

    const layout = this.tooltipLayout;

    const child = Container({
      width: isVertical ? boxWidth + gap * 2 : Infinity,
      height: isVertical ? Infinity : boxWidth + gap * 2,
      padding: EdgeInsets.symmetric(isVertical ? { horizontal: gap } : { vertical: gap }),
      child: isVertical
        ? Column({ crossAxisAlignment: CrossAxisAlignment.center, children: sections })
        : Row({ crossAxisAlignment: CrossAxisAlignment.center, children: sections }),
    });

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
        child,
        onMouseEnter: () => {
          this.computeLayout();
          this.widget.onHover();
        },
        onMouseLeave: () => {
          this.widget.onUnhover();
        },
      }),
    });
  }
}

export function toastBoxPlot(
  ...[{ dataPoint, index, legend, label, datasetIndex }, ctx]: Parameters<
    BoxPlotChartCustom<ToastBoxPlotChartConfig>["boxPlot"]
  >
): Widget {
  const { scale, config, direction } = ctx;
  if (scale == null) return SizedBox.shrink();

  const { colors, boxPlot: boxPlotConfig } = config;
  const { boxWidth, whiskerWidth, gap } = boxPlotConfig;
  const color = colors[ctx.legends.indexOf(legend) % colors.length];
  const whiskerColor = color;
  const isHovered = ctx.isBoxPlotHovered(index, legend);

  const tooltip = tooltipContent({
    label,
    items: [
      { legend: "max", color, value: dataPoint.max },
      { legend: "q3", color, value: dataPoint.q3 },
      { legend: "median", color, value: dataPoint.median },
      { legend: "q1", color, value: dataPoint.q1 },
      { legend: "min", color, value: dataPoint.min },
    ],
    config,
  });

  if (!config.tooltip.enabled) {
    const isVertical = direction === "vertical";
    const range = dataPoint.max - dataPoint.min || 1;
    const minToQ1 = (dataPoint.q1 - dataPoint.min) / range;
    const q1ToMedian = (dataPoint.median - dataPoint.q1) / range;
    const medianToQ3 = (dataPoint.q3 - dataPoint.median) / range;
    const q3ToMax = (dataPoint.max - dataPoint.q3) / range;

    const buildSection = (flex: number, child: Widget) =>
      flex > 0 ? [Flexible({ flex, child })] : [];

    const sections: Widget[] = isVertical
      ? [
          Container({ width: whiskerWidth, height: 1, color: whiskerColor }),
          ...buildSection(q3ToMax, Container({ width: 1, color: whiskerColor, height: Infinity })),
          ...buildSection(medianToQ3, Container({ width: boxWidth, color, height: Infinity })),
          Container({ width: boxWidth, height: 2, color: "white" }),
          ...buildSection(q1ToMedian, Container({ width: boxWidth, color, height: Infinity })),
          ...buildSection(minToQ1, Container({ width: 1, color: whiskerColor, height: Infinity })),
          Container({ width: whiskerWidth, height: 1, color: whiskerColor }),
        ]
      : [
          Container({ width: 1, height: whiskerWidth, color: whiskerColor }),
          ...buildSection(minToQ1, Container({ width: Infinity, height: 1, color: whiskerColor })),
          ...buildSection(q1ToMedian, Container({ height: boxWidth, color, width: Infinity })),
          Container({ width: 2, height: boxWidth, color: "white" }),
          ...buildSection(medianToQ3, Container({ height: boxWidth, color, width: Infinity })),
          ...buildSection(q3ToMax, Container({ width: Infinity, height: 1, color: whiskerColor })),
          Container({ width: 1, height: whiskerWidth, color: whiskerColor }),
        ];

    return Container({
      width: isVertical ? boxWidth + gap * 2 : Infinity,
      height: isVertical ? Infinity : boxWidth + gap * 2,
      padding: EdgeInsets.symmetric(isVertical ? { horizontal: gap } : { vertical: gap }),
      child: isVertical
        ? Column({ crossAxisAlignment: CrossAxisAlignment.center, children: sections })
        : Row({ crossAxisAlignment: CrossAxisAlignment.center, children: sections }),
    });
  }

  return new _HoverableBoxPlot({
    boxColor: color,
    whiskerColor,
    boxWidth,
    whiskerWidth,
    gap,
    dataPoint,
    tooltip,
    direction,
    chartWidth: ctx.width,
    chartHeight: ctx.height,
    isHovered,
    onHover: () => ctx.hoverBoxPlot(index, legend, { kind: "boxPlot" }),
    onUnhover: () =>
      ctx.unhoverBoxPlot({ index, legend, kind: "boxPlot" }),
  });
}
