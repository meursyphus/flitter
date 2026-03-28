import type { BulletChartCustom } from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";

export function BulletGrid(
  ...[{ xLine, yLine }, { scale: _scale, data }]: Parameters<
    BulletChartCustom["grid"]
  >
) {
  const scale = _scale!;
  const labelCount = data.labels.length;
  const valueCount = (scale.max - scale.min) / scale.step;

  // Bullet chart is always horizontal: X = value axis, Y = category axis
  return Cartesian.Grid({
    xLine,
    yLine,
    x: valueCount,
    y: labelCount,
  });
}
