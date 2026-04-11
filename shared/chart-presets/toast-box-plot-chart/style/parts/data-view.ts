import type { Widget } from "flitter-ui";
import type { BoxPlotChartCustom } from "flitter-ui/chart";
import type { ToastBoxPlotChartConfig } from "../config";
import { DataView } from "../../base/data-view";
import { AnimatedDataView } from "../../../_shared/toast/cartesian/animated-data-view";

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
