import {
  Container,
  BoxDecoration,
  Border,
  BorderRadius,
  Radius,
  SizedBox,
  GestureDetector,
  EdgeInsets,
  ZIndex,
  Offset,
  Padding,
  type Widget,
} from "flitter-core";
import Tooltip from "flitter-core/component/Tooltip";
import type { BoxPlotChartCustom } from "flitter-ui/chart";
import type { ToastBoxPlotChartConfig } from "../config";
import { tooltipContent } from "../../../_styles/toast/index";

const TOOLTIP_GAP = 4;

export function toastOutlier(
  ...[{ value, index, legend, label, datasetIndex }, ctx]: Parameters<
    BoxPlotChartCustom<ToastBoxPlotChartConfig>["outlier"]
  >
): Widget {
  const { scale, config, direction } = ctx;
  if (scale == null) return SizedBox.shrink();

  const { colors } = config;
  const color = colors[ctx.legends.indexOf(legend) % colors.length];
  const isHovered = ctx.isBoxPlotHovered(index, legend);
  const size = isHovered ? 10 : 7;

  const dot = Container({
    width: size,
    height: size,
    decoration: new BoxDecoration({
      color: isHovered ? `${color}40` : undefined,
      border: Border.all({ color, width: 1.5 }),
      borderRadius: BorderRadius.all(Radius.circular(size / 2)),
    }),
  });

  if (!config.tooltip.enabled) {
    return dot;
  }

  const tooltip = tooltipContent({
    label,
    items: { legend: `${legend} outlier`, color, value },
    config,
  });

  return Tooltip({
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
        ctx.hoverBoxPlot(index, legend, { kind: "outlier", value });
      },
      onMouseLeave: () => {
        ctx.unhoverBoxPlot({ index, legend, kind: "outlier", value });
      },
      child: dot,
    }),
  });
}
