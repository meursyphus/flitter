import {
  Alignment,
  AnimatedFractionallySizedBox,
  Stack,
  StackFit,
} from "flitter-core";
import type { BoxPlotChartCustom } from "@headless/box-plot-chart/types";
import type { ToastBoxPlotChartConfig } from "../config";

function computeAlignment(
  minRatio: number,
  maxRatio: number,
  isVertical: boolean,
): Alignment {
  const factor = maxRatio - minRatio;
  const denominator = 1 - factor;
  if (denominator <= 0) return Alignment.center;

  if (isVertical) {
    const y = (2 * (1 - maxRatio)) / denominator - 1;
    return new Alignment({ x: 0, y });
  } else {
    const x = (2 * minRatio) / denominator - 1;
    return new Alignment({ x, y: 0 });
  }
}

export function toastBoxPlotBox(
  ...[{ boxPlot, outliers, minRatio, maxRatio }, ctx]: Parameters<
    BoxPlotChartCustom<ToastBoxPlotChartConfig>["boxPlotBox"]
  >
) {
  const isVertical = ctx.direction === "vertical";
  const factor = maxRatio - minRatio;
  const alignment = computeAlignment(minRatio, maxRatio, isVertical);

  return Stack({
    fit: StackFit.expand,
    clipped: false,
    children: [
      AnimatedFractionallySizedBox({
        duration: ctx.config.animation.duration,
        alignment,
        heightFactor: isVertical ? factor : undefined,
        widthFactor: isVertical ? undefined : factor,
        child: boxPlot,
      }),
      ...outliers,
    ],
  });
}
