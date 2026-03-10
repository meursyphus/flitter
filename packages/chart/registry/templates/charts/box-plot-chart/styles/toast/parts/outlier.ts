import {
  StatefulWidget,
  State,
  Container,
  BoxDecoration,
  Border,
  BorderRadius,
  LayoutBuilder,
  Positioned,
  Radius,
  SizedBox,
  Stack,
  GestureDetector,
  EdgeInsets,
  ZIndex,
  Offset,
  Padding,
  type Widget,
} from "flitter-core";
import Tooltip from "flitter-core/component/Tooltip";
import type { BoxPlotChartCustom } from "@headless/box-plot-chart/types";
import type { ToastBoxPlotChartConfig } from "../config";
import { tooltipContent } from "@styles/toast";

const TOOLTIP_GAP = 4;

class _HoverableOutlier extends StatefulWidget {
  color: string;
  ratio: number;
  tooltip: Widget;
  direction: "vertical" | "horizontal";
  isHovered: boolean;
  onHover: () => void;
  onUnhover: () => void;

  constructor(props: {
    color: string;
    ratio: number;
    tooltip: Widget;
    direction: "vertical" | "horizontal";
    isHovered: boolean;
    onHover: () => void;
    onUnhover: () => void;
  }) {
    super();
    this.color = props.color;
    this.ratio = props.ratio;
    this.tooltip = props.tooltip;
    this.direction = props.direction;
    this.isHovered = props.isHovered;
    this.onHover = props.onHover;
    this.onUnhover = props.onUnhover;
  }

  createState() {
    return new _HoverableOutlierState();
  }
}

class _HoverableOutlierState extends State<_HoverableOutlier> {
  override build() {
    const { color, ratio, direction, tooltip, isHovered } = this.widget;
    const isVertical = direction === "vertical";
    const size = isHovered ? 10 : 7;

    return LayoutBuilder({
      builder: (_ctx, constraints) => {
        const cx = constraints.maxWidth / 2 - size / 2;
        const cy = constraints.maxHeight / 2 - size / 2;
        const left = isVertical ? cx : ratio * constraints.maxWidth - size / 2;
        const top = isVertical ? (1 - ratio) * constraints.maxHeight - size / 2 : cy;

        const dot = Container({
          width: size,
          height: size,
          decoration: new BoxDecoration({
            color: this.hovered ? `${color}40` : undefined,
            border: Border.all({ color, width: 1.5 }),
            borderRadius: BorderRadius.all(Radius.circular(size / 2)),
          }),
        });

        return SizedBox.expand({
          child: Stack({
            clipped: false,
            children: [
              Positioned({
                left: Math.max(0, left),
                top: Math.max(0, top),
                child: Tooltip({
                  position: "topCenter",
                  offset: Offset.Constants.zero,
                  translation: new Offset({ x: -0.5, y: -1 }),
                  tooltip: ZIndex({
                    zIndex: 9999,
                    child: Padding({
                      padding: EdgeInsets.only({ bottom: TOOLTIP_GAP }),
                      child: tooltip,
                    }),
                  }),
                  child: GestureDetector({
                    cursor: "default",
                    onMouseEnter: () => {
                      this.widget.onHover();
                    },
                    onMouseLeave: () => {
                      this.widget.onUnhover();
                    },
                    child: dot,
                  }),
                }),
              }),
            ],
          }),
        });
      },
    });
  }
}

export function toastOutlier(
  ...[{ value, index, legend, label, datasetIndex }, ctx]: Parameters<
    BoxPlotChartCustom<ToastBoxPlotChartConfig>["outlier"]
  >
): Widget {
  const { scale, config, direction } = ctx;
  if (scale == null) return SizedBox.shrink();

  const { colors } = config;
  const color = colors[ctx.legends.indexOf(legend) % colors.length];

  const total = scale.max - scale.min || 1;
  const ratio = (value - scale.min) / total;

  const tooltip = tooltipContent({
    label,
    items: { legend: `${legend} outlier`, color, value },
    config,
  });

  if (!config.tooltip.enabled) {
    const isVertical = direction === "vertical";
    return LayoutBuilder({
      builder: (_bCtx, constraints) => {
        const size = 7;
        const cx = constraints.maxWidth / 2 - size / 2;
        const cy = constraints.maxHeight / 2 - size / 2;
        const left = isVertical ? cx : ratio * constraints.maxWidth - size / 2;
        const top = isVertical ? (1 - ratio) * constraints.maxHeight - size / 2 : cy;

        return SizedBox.expand({
          child: Stack({
            clipped: false,
            children: [
              Positioned({
                left: Math.max(0, left),
                top: Math.max(0, top),
                child: Container({
                  width: size,
                  height: size,
                  decoration: new BoxDecoration({
                    border: Border.all({ color, width: 1.5 }),
                    borderRadius: BorderRadius.all(Radius.circular(size / 2)),
                  }),
                }),
              }),
            ],
          }),
        });
      },
    });
  }

  return new _HoverableOutlier({
    color,
    ratio,
    tooltip,
    direction,
    isHovered: ctx.isBoxPlotHovered(index, legend),
    onHover: () => ctx.hoverBoxPlot(index, legend),
    onUnhover: () => ctx.unhoverBoxPlot(),
  });
}
