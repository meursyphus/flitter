import {
  StatefulWidget,
  State,
  Alignment,
  AnimatedScale,
  Border,
  BoxDecoration,
  BoxShadow,
  Container,
  Column,
  CrossAxisAlignment,
  EdgeInsets,
  Expanded,
  FractionallySizedBox,
  MainAxisAlignment,
  Offset,
  Opacity,
  Padding,
  SizedBox,
  ZIndex,
  type Widget,
  type TooltipPosition,
} from "flitter-core";
import Tooltip from "flitter-core/component/Tooltip";
import type { CandlestickChartContext } from "flitter-ui/chart";
import type { CandlestickChartConfig } from "../config";

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

function topRight(): TooltipLayout {
  return {
    position: "topRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function bottomRight(): TooltipLayout {
  return {
    position: "bottomRight",
    translation: new Offset({ x: 1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
  };
}

function topLeft(): TooltipLayout {
  return {
    position: "topLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function bottomLeft(): TooltipLayout {
  return {
    position: "bottomLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

function computeTooltipLayout({
  elementGlobal,
  elementSize,
  plotGlobal,
  chartWidth,
  chartHeight,
}: {
  elementGlobal: { x: number; y: number };
  elementSize: { width: number; height: number };
  plotGlobal: { x: number; y: number };
  chartWidth: number;
  chartHeight: number;
}): TooltipLayout {
  const localX = elementGlobal.x - plotGlobal.x;
  const localY = elementGlobal.y - plotGlobal.y;
  const space: SpaceAround = {
    right: chartWidth - (localX + elementSize.width),
    left: localX,
    top: localY,
    bottom: chartHeight - (localY + elementSize.height),
  };

  const tooltipSize: TooltipSize = {
    width: ESTIMATED_TOOLTIP_WIDTH,
    height: ESTIMATED_TOOLTIP_HEIGHT,
  };

  const fitsRight = space.right >= tooltipSize.width + TOOLTIP_GAP;
  const fitsTop = space.top >= tooltipSize.height;

  if (fitsRight) {
    return fitsTop ? topRight() : bottomRight();
  }
  return fitsTop ? topLeft() : bottomLeft();
}

class _TooltipPositioner extends StatefulWidget {
  candlestickWidget: Widget;
  tooltipWidget: Widget;
  chartWidth: number;
  chartHeight: number;
  isHovered: boolean;

  constructor({
    candlestickWidget,
    tooltipWidget,
    chartWidth,
    chartHeight,
    isHovered,
  }: {
    candlestickWidget: Widget;
    tooltipWidget: Widget;
    chartWidth: number;
    chartHeight: number;
    isHovered: boolean;
  }) {
    super();
    this.candlestickWidget = candlestickWidget;
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
    const elementGlobal = renderObject.localToGlobal();
    const elementSize = renderObject.size;
    const { chartWidth, chartHeight } = this.widget;

    const plotGlobal = this.findPlotGlobal();
    if (!plotGlobal) return;

    this.tooltipLayout = computeTooltipLayout({
      elementGlobal,
      elementSize,
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
      return this.widget.candlestickWidget;
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
      child: this.widget.candlestickWidget,
    });
  }
}

export function toastCandlestick(
  {
    open,
    high,
    low,
    close,
    label,
    index,
    legend,
    isHovered,
  }: {
    open: number;
    high: number;
    low: number;
    close: number;
    label: string;
    index: number;
    legend: string;
    datasetIndex: number;
    isHovered: boolean;
  },
  context: CandlestickChartContext<CandlestickChartConfig>,
): Widget {
  const scale = context.scale;
  if (scale == null) return SizedBox.shrink();

  const total = scale.max - scale.min || 1;
  const isUp = close >= open;
  const color = isUp ? context.config.candlestick.upColor : context.config.candlestick.downColor;
  const wickColor = context.config.candlestick.wickColor;
  const bodyTop = Math.max(open, close);
  const bodyBottom = Math.min(open, close);
  const topWickRatio = (high - bodyTop) / total;
  const bodyRatio = (bodyTop - bodyBottom) / total || 0.002;
  const bottomWickRatio = (bodyBottom - low) / total;
  const belowRatio = (low - scale.min) / total;
  const aboveRatio = (scale.max - high) / total;
  const hoveredCandlestick = context.hoveredCandlestick;
  const activeOpacity = hoveredCandlestick == null || isHovered ? 1 : 0.28;

  const candlestickWidget = Opacity({
    opacity: activeOpacity,
    child: Container({
      width: Infinity,
      height: Infinity,
      alignment: Alignment.center,
      child: FractionallySizedBox({
        widthFactor: 0.66,
        child: AnimatedScale({
          duration: context.config.animation.duration,
          scale: isHovered ? 1.04 : 1,
          alignment: Alignment.center,
          child: Container({
            decoration:
              isHovered
                ? new BoxDecoration({
                    border: Border.all({ color: "white", width: 2, strokeAlign: 1 }),
                    boxShadow: [new BoxShadow({ color: "rgba(0,0,0,0.22)", blurRadius: 10 })],
                  })
                : undefined,
            child: Column({
              mainAxisAlignment: MainAxisAlignment.end,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                ...(aboveRatio > 0
                  ? [Expanded({ flex: Math.max(aboveRatio, 0.001), child: Container({}) })]
                  : []),
                ...(topWickRatio > 0
                  ? [
                      Expanded({
                        flex: Math.max(topWickRatio, 0.001),
                        child: Container({
                          width: isHovered ? 2 : 1,
                          color: wickColor,
                        }),
                      }),
                    ]
                  : []),
                Expanded({
                  flex: Math.max(bodyRatio, 0.001),
                  child: Container({
                    width: Infinity,
                    color,
                  }),
                }),
                ...(bottomWickRatio > 0
                  ? [
                      Expanded({
                        flex: Math.max(bottomWickRatio, 0.001),
                        child: Container({
                          width: isHovered ? 2 : 1,
                          color: wickColor,
                        }),
                      }),
                    ]
                  : []),
                ...(belowRatio > 0
                  ? [Expanded({ flex: Math.max(belowRatio, 0.001), child: Container({}) })]
                  : []),
              ],
            }),
          }),
        }),
      }),
    }),
  });

  if (!context.config.tooltip.enabled) {
    return candlestickWidget;
  }

  const tooltipWidget = context.custom.tooltip(
    {
      label,
      items: [
        { legend: `${legend} open`, color, value: open },
        { legend: `${legend} high`, color: wickColor, value: high },
        { legend: `${legend} low`, color: wickColor, value: low },
        { legend: `${legend} close`, color, value: close },
      ],
    },
    context,
  );

  return new _TooltipPositioner({
    candlestickWidget,
    tooltipWidget,
    chartWidth: context.width,
    chartHeight: context.height,
    isHovered,
  });
}
