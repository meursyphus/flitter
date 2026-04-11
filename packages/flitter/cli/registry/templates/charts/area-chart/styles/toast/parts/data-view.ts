import {
  Stack,
  Positioned,
  type Widget,
} from "flitter-core";
import type { LineChartCustom } from "@headless/line-chart/types";
import type { ToastAreaChartConfig } from "../config";
import { AnimatedDataView } from "@styles/toast/cartesian/animated-data-view";

export function toastDataView(
  ...[args, ctx]: Parameters<LineChartCustom<ToastAreaChartConfig>["dataView"]>
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

  const stack = Stack({ children });

  if (!animation.enabled) return stack;

  return new AnimatedDataView({
    child: stack,
    duration: animation.duration,
    isVertical: false,
    baselineRatio: 0,
  });
}
