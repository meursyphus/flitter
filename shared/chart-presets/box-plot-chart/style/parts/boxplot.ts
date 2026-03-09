import {
  Container,
  Column,
  CrossAxisAlignment,
  Flexible,
  Opacity,
  SizedBox,
  GestureDetector,
  EdgeInsets,
  type Widget,
} from "flitter-core";
import type { BoxPlotChartCustom } from "flitter-ui/chart";
import type { AgBoxPlotChartConfig } from "../config";

export function agBoxPlot(
  ...[{ dataPoint, index, legend, label, datasetIndex }, ctx]: Parameters<
    BoxPlotChartCustom<AgBoxPlotChartConfig>["boxPlot"]
  >
): Widget {
  const { scale, config } = ctx;
  if (scale == null) return SizedBox.shrink();

  const { colors, boxPlot: boxPlotConfig } = config;
  const { boxWidth, whiskerWidth, gap } = boxPlotConfig;
  const total = scale.max - scale.min;

  const boxColor = colors.fills[datasetIndex % colors.fills.length];
  const strokeColor = colors.strokes[datasetIndex % colors.strokes.length];

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

  const { hoveredBoxPlot } = ctx;
  const isHovered = ctx.isBoxPlotHovered(index, legend);

  let opacity = 1;
  if (hoveredBoxPlot != null) {
    if (isHovered) {
      opacity = 1;
    } else if (hoveredBoxPlot.legend === legend) {
      opacity = 0.8;
    } else {
      opacity = 0.3;
    }
  }

  const boxWidget = Container({
    width: boxWidth + gap * 2,
    height: Infinity,
    padding: EdgeInsets.symmetric({ horizontal: gap }),
    child: Column({
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        ...(aboveMax > 0
          ? [Flexible({ flex: aboveMax, child: SizedBox({ width: 1 }) })]
          : []),
        // Max cap
        Container({ width: whiskerWidth, height: 1, color: strokeColor }),
        // Whisker: max to q3
        ...(q3ToMax > 0
          ? [
              Flexible({
                flex: q3ToMax,
                child: Container({
                  width: 1,
                  color: strokeColor,
                  height: Infinity,
                }),
              }),
            ]
          : []),
        // Box: q3 to median
        ...(medianToQ3 > 0
          ? [
              Flexible({
                flex: medianToQ3,
                child: Container({
                  width: boxWidth,
                  color: boxColor,
                  height: Infinity,
                }),
              }),
            ]
          : []),
        // Median line
        Container({ width: boxWidth, height: 2, color: strokeColor }),
        // Box: median to q1
        ...(q1ToMedian > 0
          ? [
              Flexible({
                flex: q1ToMedian,
                child: Container({
                  width: boxWidth,
                  color: boxColor,
                  height: Infinity,
                }),
              }),
            ]
          : []),
        // Whisker: q1 to min
        ...(minToQ1 > 0
          ? [
              Flexible({
                flex: minToQ1,
                child: Container({
                  width: 1,
                  color: strokeColor,
                  height: Infinity,
                }),
              }),
            ]
          : []),
        // Min cap
        Container({ width: whiskerWidth, height: 1, color: strokeColor }),
        ...(belowMin > 0
          ? [Flexible({ flex: belowMin, child: SizedBox({ width: 1 }) })]
          : []),
      ],
    }),
  });

  return GestureDetector({
    cursor: "default",
    onMouseEnter: () => ctx.hoverBoxPlot(index, legend),
    child:
      opacity < 1
        ? Opacity({ opacity, child: boxWidget })
        : boxWidget,
  });
}
