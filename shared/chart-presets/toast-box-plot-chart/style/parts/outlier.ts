import {
  Container,
  BoxDecoration,
  Border,
  BorderRadius,
  LayoutBuilder,
  Positioned,
  Radius,
  SizedBox,
  Stack,
  GestureDetector,
  type Widget,
} from "flitter-core";
import type { BoxPlotChartCustom } from "flitter-ui/chart";
import type { ToastBoxPlotChartConfig } from "../config";

export function toastOutlier(
  ...[{ value, index, legend, label, datasetIndex }, ctx]: Parameters<
    BoxPlotChartCustom<ToastBoxPlotChartConfig>["outlier"]
  >
): Widget {
  const { scale, config } = ctx;
  if (scale == null) return SizedBox.shrink();

  const { colors } = config;
  const color = colors[datasetIndex % colors.length];

  const total = scale.max - scale.min || 1;
  const ratio = (value - scale.min) / total;

  const isHovered = ctx.isBoxPlotHovered(index, legend);
  const size = isHovered ? 8 : 6;

  return GestureDetector({
    cursor: "default",
    onMouseEnter: () => ctx.hoverBoxPlot(index, legend),
    onMouseLeave: () => ctx.unhoverBoxPlot(),
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
                    color: isHovered ? `${color}40` : `${color}25`,
                    border: Border.all({ color, width: 1.5 }),
                    borderRadius: BorderRadius.all(Radius.circular(size / 2)),
                  }),
                }),
              }),
            ],
          }),
        });
      },
    }),
  });
}
