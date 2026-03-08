import type { LineChartCustom } from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";

export function Grid(
  ...[{ xLine, yLine }, ctx]: Parameters<LineChartCustom["grid"]>
) {
  const { data, scale } = ctx;
  if (scale == null) return Cartesian.Grid({ xLine, yLine, x: 0, y: 0 });

  const labelCount = data.labels.length - 1;
  const valueCount = (scale.max - scale.min) / scale.step;

  return Cartesian.Grid({
    xLine,
    yLine,
    y: valueCount,
    x: labelCount,
  });
}
