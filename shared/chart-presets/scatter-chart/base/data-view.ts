import type { ScatterChartCustom } from "flitter-ui/chart";
import { Stack, Align, Alignment } from "flitter-ui";

export function DataView(
  ...[{ scatters, scale }]: Parameters<ScatterChartCustom["dataView"]>
) {
  const children = scatters.map((pt) => {
    const normX = (pt.x - scale.x.min) / (scale.x.max - scale.x.min);
    const normY = (pt.y - scale.y.min) / (scale.y.max - scale.y.min);

    return Align({
      alignment: new Alignment({ x: normX * 2 - 1, y: 1 - normY * 2 }),
      child: pt.widget,
    });
  });

  return Stack({ clipped: false, children });
}
