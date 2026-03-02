import type { BubbleChartCustom } from "@headless/bubble-chart/types";
import { Stack, Align, Alignment } from "flitter-core";

export function Series(
  ...[{ bubbles, scale }]: Parameters<BubbleChartCustom["series"]>
) {
  const children = bubbles.map((pt) => {
    const normX = (pt.x - scale.x.min) / (scale.x.max - scale.x.min);
    const normY = (pt.y - scale.y.min) / (scale.y.max - scale.y.min);

    return Align({
      alignment: new Alignment({ x: normX * 2 - 1, y: 1 - normY * 2 }),
      child: pt.widget,
    });
  });

  return Stack({ clipped: false, children });
}
