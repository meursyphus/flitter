import * as Cartesian from "@shared/cartesian/index";
import { BoxPlotChartCustom } from "../types";

export function Grid(
  ...[{ xLine, yLine }, { data, scale }]: Parameters<BoxPlotChartCustom["grid"]>
) {
  if (scale == null) {
    return Cartesian.Grid({ xLine, yLine, x: data.labels.length, y: 0 });
  }
  const labelCount = data.labels.length;
  const valueCount = (scale.max - scale.min) / scale.step;

  return Cartesian.Grid({
    xLine,
    yLine,
    x: labelCount,
    y: valueCount,
  });
}
