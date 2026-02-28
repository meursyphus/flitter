import * as Cartesian from "@shared/cartesian/index";
import { BarChartCustom } from "../types";

export function Grid(
  ...[{ xLine, yLine }, { direction, scale: _scale, data }]: Parameters<
    BarChartCustom["grid"]
  >
) {
  const scale = _scale!;
  const labelCount = data.labels.length;
  const valueCount = (scale.max - scale.min) / scale.step;

  return Cartesian.Grid({
    xLine,
    yLine,
    x: direction === "vertical" ? labelCount : valueCount,
    y: direction === "horizontal" ? labelCount : valueCount,
  });
}
