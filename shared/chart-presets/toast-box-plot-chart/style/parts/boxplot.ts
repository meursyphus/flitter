import {
  Container,
  Column,
  Row,
  CrossAxisAlignment,
  Flexible,
  SizedBox,
  EdgeInsets,
  BoxDecoration,
  Border,
  BoxShadow,
  type Widget,
} from "flitter-ui";
import type { BoxPlotChartCustom, BoxPlotDataPoint } from "flitter-ui/chart";
import type { ToastBoxPlotChartConfig } from "../config";

export function toastBoxPlot(
  ...[{ dataPoint, index, legend, label, datasetIndex, isHovered }, ctx]: Parameters<
    BoxPlotChartCustom<ToastBoxPlotChartConfig>["boxPlot"]
  >
): Widget {
  const { scale, config, direction } = ctx;
  if (scale == null) return SizedBox.shrink();

  const { colors, boxPlot: boxPlotConfig } = config;
  const { boxWidth, whiskerWidth, gap } = boxPlotConfig;
  const color = colors[ctx.legends.indexOf(legend) % colors.length];

  const isVertical = direction === "vertical";
  const range = dataPoint.max - dataPoint.min || 1;
  const minToQ1 = (dataPoint.q1 - dataPoint.min) / range;
  const q1ToMedian = (dataPoint.median - dataPoint.q1) / range;
  const medianToQ3 = (dataPoint.q3 - dataPoint.median) / range;
  const q3ToMax = (dataPoint.max - dataPoint.q3) / range;

  const decoration = isHovered
    ? new BoxDecoration({
        color: color,
        border: Border.all({ color: "white", width: 4, strokeAlign: 1 }),
        boxShadow: [new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 8 })],
      })
    : new BoxDecoration({ color: color });

  const buildSection = (flex: number, child: Widget) =>
    flex > 0 ? [Flexible({ flex, child })] : [];

  const sections: Widget[] = isVertical
    ? [
        Container({ width: whiskerWidth, height: 1, color: color }),
        ...buildSection(q3ToMax, Container({ width: isHovered ? 2 : 1, color: color, height: Infinity })),
        ...buildSection(medianToQ3, Container({ width: boxWidth, height: Infinity, decoration })),
        Container({ width: boxWidth, height: 2, color: "white" }),
        ...buildSection(q1ToMedian, Container({ width: boxWidth, height: Infinity, decoration })),
        ...buildSection(minToQ1, Container({ width: isHovered ? 2 : 1, color: color, height: Infinity })),
        Container({ width: whiskerWidth, height: 1, color: color }),
      ]
    : [
        Container({ width: 1, height: whiskerWidth, color: color }),
        ...buildSection(minToQ1, Container({ width: Infinity, height: isHovered ? 2 : 1, color: color })),
        ...buildSection(q1ToMedian, Container({ height: boxWidth, width: Infinity, decoration })),
        Container({ width: 2, height: boxWidth, color: "white" }),
        ...buildSection(medianToQ3, Container({ height: boxWidth, width: Infinity, decoration })),
        ...buildSection(q3ToMax, Container({ width: Infinity, height: isHovered ? 2 : 1, color: color })),
        Container({ width: 1, height: whiskerWidth, color: color }),
      ];

  return Container({
    width: isVertical ? boxWidth + gap * 2 : Infinity,
    height: isVertical ? Infinity : boxWidth + gap * 2,
    padding: EdgeInsets.symmetric(isVertical ? { horizontal: gap } : { vertical: gap }),
    child: isVertical
      ? Column({ crossAxisAlignment: CrossAxisAlignment.center, children: sections })
      : Row({ crossAxisAlignment: CrossAxisAlignment.center, children: sections }),
  });
}
