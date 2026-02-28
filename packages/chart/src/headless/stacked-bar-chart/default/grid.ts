import * as Cartesian from "@shared/cartesian/index";
import type { StackedBarChartCustom } from "../types";

export function Grid(
  ...[{ xLine, yLine }, ctx]: Parameters<StackedBarChartCustom["grid"]>
) {
  const { data, direction, scale } = ctx;
  if (scale == null) return Cartesian.Grid({ xLine, yLine, x: 0, y: 0 });

  const labelCount = data.labels.length;
  const valueCount = (scale.max - scale.min) / scale.step;

  return Cartesian.Grid({
    xLine,
    yLine,
    x: direction === "vertical" ? labelCount : valueCount,
    y: direction === "horizontal" ? labelCount : valueCount,
  });
}
