import * as Cartesian from "@shared/cartesian/index";
import { LineChartCustom } from "../types";

export function Grid(
  ...[{ xLine, yLine }, { data, scale }]: Parameters<LineChartCustom["grid"]>
) {
  const labelCount = data.labels.length - 1;
  const valueCount = (scale.max - scale.min) / scale.step;

  return Cartesian.Grid({
    xLine,
    yLine,
    y: valueCount,
    x: labelCount,
  });
}
