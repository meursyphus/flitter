import {
  Stack,
  Positioned,
  type Widget,
} from "flitter-core";
import type { LineChartCustom } from "flitter-ui/chart";
import type { ToastLineChartConfig } from "../config";
import { AnimatedDataView } from "../../../_styles/toast/cartesian/animated-data-view";

export function toastDataView(
  ...[args, ctx]: Parameters<LineChartCustom<ToastLineChartConfig>["dataView"]>
) {
  const { lines } = args;
  const datasets = ctx.data.datasets;
  const { animation } = ctx.config;

  const children: Widget[] = lines.map((line, i) =>
    Positioned({
      key: datasets[i]?.legend ?? i,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      child: line,
    }),
  );

  const overlay = Stack({ clipped: false, children });

  if (!animation.enabled) return overlay;

  return new AnimatedDataView({
    child: overlay,
    duration: animation.duration,
    isVertical: false,
    baselineRatio: 0,
  });
}
