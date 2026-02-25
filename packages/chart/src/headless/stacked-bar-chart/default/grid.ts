import * as Cartesian from "@shared/cartesian/index";
import { StackedBarChartCustom } from "../types";

export function Grid(
  ...[{ xLine, yLine }, { data, direction, scale }]: Parameters<
    StackedBarChartCustom["grid"]
  >
) {
  const labelCount = data.labels.length;
  const valueCount = (scale.max - scale.min) / scale.step;

  return Cartesian.Grid({
    xLine,
    yLine,
    x: direction === "vertical" ? labelCount : valueCount,
    y: direction === "horizontal" ? labelCount : valueCount,
  });
}
