import type { BubbleChartCustom } from "@headless/bubble-chart/types";
import type { AgBubbleChartConfig } from "../config";
import { Stack, Align, Alignment } from "flitter-core";

export function agSeries(
  ...[{ points, scale }, context]: Parameters<BubbleChartCustom<AgBubbleChartConfig>["series"]>
) {
  const children = points.map((pt) => {
    const normX = (pt.x - scale.x.min) / (scale.x.max - scale.x.min);
    const normY = (pt.y - scale.y.min) / (scale.y.max - scale.y.min);
    const alignmentX = normX * 2 - 1;
    const alignmentY = 1 - normY * 2;

    return Align({
      key: `${pt.legend}-${pt.label}`,
      alignment: new Alignment({ x: alignmentX, y: alignmentY }),
      child: context.custom.bubble(
        { value: pt.value, label: pt.label, legend: pt.legend, index: pt.index },
        context,
      ),
    });
  });

  return Stack({ clipped: false, children });
}
