import type { Widget } from "flitter-ui";
import type { BarChartCustom } from "flitter-ui/chart";
import type { ToastStackedBarChartConfig } from "../config";
import { DataView } from "../../../_shared/toast/bar-like/index";
import { AnimatedDataView } from "../../../_shared/toast/cartesian/animated-data-view";

export function toastDataView(
  ...[args, context]: Parameters<BarChartCustom<ToastStackedBarChartConfig>["dataView"]>
): Widget {
  const child = DataView(args, context);

  const scale = context.scale;
  const isVertical = context.direction === "vertical";
  const baselineRatio =
    scale ? Math.max(0, Math.min(1, (0 - scale.min) / (scale.max - scale.min))) : 0;

  return new AnimatedDataView({
    child,
    duration: context.config.animation.duration,
    isVertical,
    baselineRatio,
  });
}
