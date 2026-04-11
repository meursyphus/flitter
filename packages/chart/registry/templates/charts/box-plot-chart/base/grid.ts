import * as Cartesian from "@shared/cartesian/index";
import { BoxPlotChartCustom } from "../types";

export function Grid(
  ...[{ xLine, yLine }, { data, scale, direction }]: Parameters<BoxPlotChartCustom["grid"]>
) {
  const isVertical = direction === "vertical";
  const labelCount = data.labels.length;

  if (scale == null) {
    return Cartesian.Grid({
      xLine,
      yLine,
      x: isVertical ? labelCount : 0,
      y: isVertical ? 0 : labelCount,
    });
  }

  const valueCount = (scale.max - scale.min) / scale.step;

  return Cartesian.Grid({
    xLine,
    yLine,
    x: isVertical ? labelCount : valueCount,
    y: isVertical ? valueCount : labelCount,
  });
}
