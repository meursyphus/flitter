import type { Widget } from "flitter-core";
import type { BarChartCustom } from "flitter-ui/chart";
import type { ToastBarChartConfig } from "../config";
import { DataView } from "../../../../toast-base/bar-like/index";
import { AnimatedDataView } from "../../../../toast-base/cartesian/animated-data-view";

export function toastDataView(
  ...[args, context]: Parameters<BarChartCustom<ToastBarChartConfig>["dataView"]>
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
