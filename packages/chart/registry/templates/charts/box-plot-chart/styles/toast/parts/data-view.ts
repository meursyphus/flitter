import type { Widget } from "flitter-core";
import type { BoxPlotChartCustom } from "@headless/box-plot-chart/types";
import type { ToastBoxPlotChartConfig } from "../config";
import { DataView } from "../../../base/data-view";
import { AnimatedDataView } from "@styles/toast/cartesian/animated-data-view";

export function toastDataView(
  ...[args, context]: Parameters<BoxPlotChartCustom<ToastBoxPlotChartConfig>["dataView"]>
): Widget {
  const child = DataView(args, context);
  const isVertical = context.direction === "vertical";

  return new AnimatedDataView({
    child,
    duration: context.config.animation.duration,
    isVertical,
    baselineRatio: 0,
  });
}
