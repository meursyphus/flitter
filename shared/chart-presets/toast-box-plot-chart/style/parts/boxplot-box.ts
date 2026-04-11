import {
  Alignment,
  Align,
  AnimatedFractionallySizedBox,
  IntrinsicWidth,
  IntrinsicHeight,
  Stack,
  StackFit,
  type Widget,
} from "flitter-ui";
import type { BoxPlotChartCustom } from "flitter-ui/chart";
import type { ToastBoxPlotChartConfig } from "../config";

function computeBoxAlignment(
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

function outlierAlignment(ratio: number, isVertical: boolean): Alignment {
  if (isVertical) {
    return new Alignment({ x: 0, y: 1 - 2 * ratio });
  }
  return new Alignment({ x: 2 * ratio - 1, y: 0 });
}

export function toastBoxPlotBox(
  ...[{ boxPlot, outliers, minRatio, maxRatio }, ctx]: Parameters<
    BoxPlotChartCustom<ToastBoxPlotChartConfig>["boxPlotBox"]
  >
) {
  const isVertical = ctx.direction === "vertical";
  const factor = maxRatio - minRatio;
  const alignment = computeBoxAlignment(minRatio, maxRatio, isVertical);

  const stack = Stack({
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
      ...outliers.map(({ widget, ratio }) =>
        Align({
          alignment: outlierAlignment(ratio, isVertical),
          child: widget,
        }),
      ),
    ],
  });

  return isVertical
    ? IntrinsicWidth({ child: stack })
    : IntrinsicHeight({ child: stack });
}
