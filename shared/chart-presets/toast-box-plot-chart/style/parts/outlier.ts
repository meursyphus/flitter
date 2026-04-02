import {
  Container,
  BoxDecoration,
  Border,
  BorderRadius,
  Radius,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { BoxPlotChartCustom } from "flitter-ui/chart";
import type { ToastBoxPlotChartConfig } from "../config";

export function toastOutlier(
  ...[{ value, index, legend, label, datasetIndex, isHovered }, ctx]: Parameters<
    BoxPlotChartCustom<ToastBoxPlotChartConfig>["outlier"]
  >
): Widget {
  const { scale, config } = ctx;
  if (scale == null) return SizedBox.shrink();

  const { colors } = config;
  const color = colors[ctx.legends.indexOf(legend) % colors.length];
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
  return dot;
}
