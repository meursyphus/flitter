import {
  Alignment,
  Axis as FlexAxis,
  Container,
  CrossAxisAlignment,
  Expanded,
  Flex,
  FractionallySizedBox,
  MainAxisAlignment,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { BarChartCustom } from "flitter-ui/chart";

export function stackedBarGroup<TConfig>(
  ...[{ bars, label, index: categoryIndex }, ctx]: Parameters<BarChartCustom<TConfig>['barGroup']>
): Widget {
  const { scale, direction } = ctx;
  if (scale == null) return SizedBox.shrink();

  const isVertical = direction === "vertical";
  const total = scale.max - scale.min;
  const hasNegative = scale.min < 0;

  const positiveValues: { bar: Widget; value: number; datasetIndex: number }[] = [];
  const negativeValues: { bar: Widget; value: number; datasetIndex: number }[] = [];

  bars.forEach((item) => {
    if (item.value >= 0) {
      positiveValues.push(item);
    } else {
      negativeValues.push(item);
    }
  });

  const buildStack = (
    items: { bar: Widget; value: number; datasetIndex: number }[],
    baseAlignment: Alignment,
    rangeMax: number,
    mainAxisAlign: MainAxisAlignment,
  ) => {
    const stackChildren = [...items].reverse().map(({ bar, value, datasetIndex }) => {
      const ratio = Math.abs(value) / rangeMax;
      const legend = ctx.data.datasets[datasetIndex].legend;
      return ctx.custom.barBox(
        { bar, value, ratio, alignment: baseAlignment, index: datasetIndex, label, legend, isHovered: ctx.isBarHovered(categoryIndex, legend) },
        ctx,
      );
    });

    return Flex({
      mainAxisAlignment: mainAxisAlign,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      direction: isVertical ? FlexAxis.vertical : FlexAxis.horizontal,
      children: stackChildren,
    });
  };

  let innerChild: Widget;

  if (!hasNegative) {
    const alignment = isVertical
      ? Alignment.bottomCenter
      : Alignment.centerLeft;
    innerChild = FractionallySizedBox({
      widthFactor: isVertical ? 0.6 : undefined,
      heightFactor: isVertical ? undefined : 0.6,
      child: buildStack(
        positiveValues,
        alignment,
        total,
        isVertical ? MainAxisAlignment.end : MainAxisAlignment.start,
      ),
    });
  } else {
    const positiveMax = scale.max;
    const negativeMax = Math.abs(scale.min);

    const positiveAlignment = isVertical
      ? Alignment.bottomCenter
      : Alignment.centerLeft;
    const negativeAlignment = isVertical
      ? Alignment.topCenter
      : Alignment.centerRight;

    const positiveChild =
      positiveValues.length > 0
        ? buildStack(
            positiveValues,
            positiveAlignment,
            positiveMax,
            isVertical ? MainAxisAlignment.end : MainAxisAlignment.start,
          )
        : SizedBox.shrink();
    const negativeChild =
      negativeValues.length > 0
        ? buildStack(
            negativeValues,
            negativeAlignment,
            negativeMax,
            isVertical ? MainAxisAlignment.start : MainAxisAlignment.end,
          )
        : SizedBox.shrink();

    innerChild = FractionallySizedBox({
      widthFactor: isVertical ? 0.6 : undefined,
      heightFactor: isVertical ? undefined : 0.6,
      child: isVertical
        ? Flex({
            direction: FlexAxis.vertical,
            children: [
              Expanded({ flex: positiveMax, child: positiveChild }),
              Expanded({ flex: negativeMax, child: negativeChild }),
            ],
          })
        : Flex({
            direction: FlexAxis.horizontal,
            children: [
              Expanded({ flex: negativeMax, child: negativeChild }),
              Expanded({ flex: positiveMax, child: positiveChild }),
            ],
          }),
    });
  }

  return Container({
    width: Infinity,
    height: Infinity,
    child: innerChild,
  });
}
