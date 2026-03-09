import {
  Container,
  BoxDecoration,
  Border,
  BorderRadius,
  LayoutBuilder,
  Opacity,
  Positioned,
  Radius,
  SizedBox,
  Stack,
  GestureDetector,
  type Widget,
} from "flitter-core";
import type { BoxPlotChartCustom } from "flitter-ui/chart";
import type { AgBoxPlotChartConfig } from "../config";

export function agOutlier(
  ...[{ value, index, legend, label, datasetIndex }, ctx]: Parameters<
    BoxPlotChartCustom<AgBoxPlotChartConfig>["outlier"]
  >
): Widget {
  const { scale, config } = ctx;
  if (scale == null) return SizedBox.shrink();

  const { colors } = config;
  const color = colors.fills[datasetIndex % colors.fills.length];
  const strokeColor = colors.strokes[datasetIndex % colors.strokes.length];

  const total = scale.max - scale.min || 1;
  const ratio = (value - scale.min) / total;

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

  const size = isHovered ? 8 : 6;

  return GestureDetector({
    cursor: "default",
    onMouseEnter: () => ctx.hoverBoxPlot(index, legend),
    child: Opacity({
      opacity,
      child: LayoutBuilder({
        builder: (_ctx, constraints) => {
          const datasetCount = Math.max(1, ctx.data.datasets.length);
          const boxWidth = constraints.maxWidth / datasetCount;
          const left = boxWidth * datasetIndex + boxWidth / 2 - size / 2;
          const top = (1 - ratio) * constraints.maxHeight - size / 2;

          return SizedBox.expand({
            child: Stack({
              children: [
                Positioned({
                  left: Math.max(0, left),
                  top: Math.max(0, top),
                  child: Container({
                    width: size,
                    height: size,
                    decoration: new BoxDecoration({
                      color: isHovered ? `${color}30` : `${color}20`,
                      border: Border.all({ color: strokeColor, width: 1.5 }),
                      borderRadius: BorderRadius.all(Radius.circular(size / 2)),
                    }),
                  }),
                }),
              ],
            }),
          });
        },
      }),
    }),
  });
}
