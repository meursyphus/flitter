import type { Widget } from "flitter-core";
import type { BarChartCustom } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "../config";
import { Series } from "@shared/bar-like";
import { AnimatedSeries } from "@styles/toast/cartesian/animated-series";

export function toastSeries(
  ...[args, context]: Parameters<BarChartCustom<ToastBarChartConfig>["series"]>
): Widget {
  const child = Series(args, context);

  const scale = context.scale;
  const isVertical = context.direction === "vertical";
  const baselineRatio =
    scale ? Math.max(0, Math.min(1, (0 - scale.min) / (scale.max - scale.min))) : 0;

  return new AnimatedSeries({
    child,
    duration: context.config.animation.duration,
    isVertical,
    baselineRatio,
  });
}
