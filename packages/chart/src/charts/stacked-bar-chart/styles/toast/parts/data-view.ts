import type { Widget } from "flitter-core";
import type { BarChartCustom } from "@headless/bar-chart/types";
import type { ToastStackedBarChartConfig } from "../config";
import { DataView } from "@shared/bar-like";
import { AnimatedDataView } from "@styles/toast/cartesian/animated-data-view";

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
