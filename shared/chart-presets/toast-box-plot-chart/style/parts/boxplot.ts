import {
  Container,
  Column,
  CrossAxisAlignment,
  Flexible,
  SizedBox,
  GestureDetector,
  EdgeInsets,
  BoxDecoration,
  Border,
  BoxShadow,
  type Widget,
} from "flitter-core";
import type {
  BoxPlotChartCustom,
  BoxPlotChartContext,
  BoxPlotDataPoint,
} from "flitter-ui/chart";
import type { ToastBoxPlotChartConfig } from "../config";

export function toastBoxPlot(
  ...[{ dataPoint, index, legend, label, datasetIndex }, ctx]: Parameters<
    BoxPlotChartCustom<ToastBoxPlotChartConfig>["boxPlot"]
  >
): Widget {
  const { scale, config } = ctx;
  if (scale == null) return SizedBox.shrink();

  const { colors, boxPlot: boxPlotConfig } = config;
  const { boxWidth, whiskerWidth, gap } = boxPlotConfig;
  const total = scale.max - scale.min;
  const boxColor = colors[datasetIndex % colors.length];
  const whiskerColor = "#888";

  const minRatio = (dataPoint.min - scale.min) / total;
  const q1Ratio = (dataPoint.q1 - scale.min) / total;
  const medianRatio = (dataPoint.median - scale.min) / total;
  const q3Ratio = (dataPoint.q3 - scale.min) / total;
  const maxRatio = (dataPoint.max - scale.min) / total;

  const belowMin = minRatio;
  const minToQ1 = q1Ratio - minRatio;
  const q1ToMedian = medianRatio - q1Ratio;
  const medianToQ3 = q3Ratio - medianRatio;
  const q3ToMax = maxRatio - q3Ratio;
  const aboveMax = 1 - maxRatio;

  const isHovered = ctx.isBoxPlotHovered(index, legend);

  return GestureDetector({
    cursor: "default",
    onMouseEnter: () => ctx.hoverBoxPlot(index, legend),
    child: Container({
      width: boxWidth + gap * 2,
      height: Infinity,
      padding: EdgeInsets.symmetric({ horizontal: gap }),
      decoration: isHovered
        ? new BoxDecoration({
            border: Border.all({ color: "rgba(255,255,255,0.8)", width: 2 }),
            boxShadow: [new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 8 })],
          })
        : undefined,
      child: Column({
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          ...(aboveMax > 0
            ? [Flexible({ flex: aboveMax, child: SizedBox({ width: 1 }) })]
            : []),
          Container({ width: whiskerWidth, height: 1, color: whiskerColor }),
          ...(q3ToMax > 0
            ? [
                Flexible({
                  flex: q3ToMax,
                  child: Container({ width: 1, color: whiskerColor, height: Infinity }),
                }),
              ]
            : []),
          ...(medianToQ3 > 0
            ? [
                Flexible({
                  flex: medianToQ3,
                  child: Container({ width: boxWidth, color: boxColor, height: Infinity }),
                }),
              ]
            : []),
          Container({ width: boxWidth, height: 2, color: "white" }),
          ...(q1ToMedian > 0
            ? [
                Flexible({
                  flex: q1ToMedian,
                  child: Container({ width: boxWidth, color: boxColor, height: Infinity }),
                }),
              ]
            : []),
          ...(minToQ1 > 0
            ? [
                Flexible({
                  flex: minToQ1,
                  child: Container({ width: 1, color: whiskerColor, height: Infinity }),
                }),
              ]
            : []),
          Container({ width: whiskerWidth, height: 1, color: whiskerColor }),
          ...(belowMin > 0
            ? [Flexible({ flex: belowMin, child: SizedBox({ width: 1 }) })]
            : []),
        ],
      }),
    }),
  });
}
