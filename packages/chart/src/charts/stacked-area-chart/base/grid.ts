import * as Cartesian from "@shared/cartesian/index";
import { SizedBox } from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";

export function Grid(
  ...[{ xLine, yLine }, ctx]: Parameters<
    StackedAreaChartCustom["grid"]>
) {
  const { data, scale } = ctx;
  if (scale == null) return SizedBox.shrink();

  const labelCount = data.labels.length - 1;
  const valueCount = (scale.max - scale.min) / scale.step;

  return Cartesian.Grid({
    xLine,
    yLine,
    y: valueCount,
    x: labelCount,
  });
}
