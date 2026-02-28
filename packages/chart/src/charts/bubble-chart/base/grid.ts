import * as Cartesian from "@shared/cartesian/index";
import type { BubbleChartCustom } from "@headless/bubble-chart/types";

export function Grid(
  ...[{ xLine, yLine }, ctx]: Parameters<BubbleChartCustom["grid"]>
) {
  const { scale } = ctx;
  if (scale == null) return Cartesian.Grid({ xLine, yLine, x: 0, y: 0 });

  const x = (scale.x.max - scale.x.min) / scale.x.step;
  const y = (scale.y.max - scale.y.min) / scale.y.step;

  return Cartesian.Grid({
    xLine,
    yLine,
    x,
    y,
  });
}
