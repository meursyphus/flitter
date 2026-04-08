import type { BulletChartCustom } from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";

export function BulletGrid(
  ...[{ xLine, yLine }, { scale: _scale, data, direction }]: Parameters<
    BulletChartCustom["grid"]
  >
) {
  const scale = _scale!;
  const labelCount = data.labels.length;
  const valueCount = (scale.max - scale.min) / scale.step;

  return Cartesian.Grid({
    xLine,
    yLine,
    x: direction === "vertical" ? labelCount : valueCount,
    y: direction === "vertical" ? valueCount : labelCount,
  });
}
