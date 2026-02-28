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
import type { BarChartCustom } from "@headless/bar-chart/types";

export function stackedBarGroup<TConfig>(
  ...[{ bars }, ctx]: Parameters<BarChartCustom<TConfig>['barGroup']>
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
  ) => {
    const stackChildren = [...items].reverse().map(({ bar, value, datasetIndex }) => {
      const flexValue = Math.abs(value);
      return Expanded({
        flex: flexValue,
        child: ctx.custom.barBox({ bar, value, ratio: 1.0, alignment: baseAlignment, index: datasetIndex }, ctx),
      });
    });

    return Flex({
      mainAxisAlignment: MainAxisAlignment.start,
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
    const stackSum = positiveValues.reduce((sum, item) => sum + Math.abs(item.value), 0);
    const stackRatio = stackSum / total;
    innerChild = FractionallySizedBox({
      alignment,
      widthFactor: isVertical ? 0.6 : stackRatio,
      heightFactor: isVertical ? stackRatio : 0.6,
      child: buildStack(positiveValues, alignment),
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

    const positiveSum = positiveValues.reduce((sum, item) => sum + item.value, 0);
    const negativeSum = negativeValues.reduce((sum, item) => sum + Math.abs(item.value), 0);
    const positiveRatio = positiveMax > 0 ? positiveSum / positiveMax : 0;
    const negativeRatio = negativeMax > 0 ? negativeSum / negativeMax : 0;

    const positiveChild =
      positiveValues.length > 0
        ? FractionallySizedBox({
            alignment: positiveAlignment,
            widthFactor: isVertical ? 0.6 : positiveRatio,
            heightFactor: isVertical ? positiveRatio : 0.6,
            child: buildStack(positiveValues, positiveAlignment),
          })
        : SizedBox.shrink();
    const negativeChild =
      negativeValues.length > 0
        ? FractionallySizedBox({
            alignment: negativeAlignment,
            widthFactor: isVertical ? 0.6 : negativeRatio,
            heightFactor: isVertical ? negativeRatio : 0.6,
            child: buildStack(negativeValues, negativeAlignment),
          })
        : SizedBox.shrink();

    if (isVertical) {
      innerChild = Flex({
        direction: FlexAxis.vertical,
        children: [
          Expanded({ flex: positiveMax, child: positiveChild }),
          Expanded({ flex: negativeMax, child: negativeChild }),
        ],
      });
    } else {
      innerChild = Flex({
        direction: FlexAxis.horizontal,
        children: [
          Expanded({ flex: negativeMax, child: negativeChild }),
          Expanded({ flex: positiveMax, child: positiveChild }),
        ],
      });
    }
  }

  return Container({
    width: Infinity,
    height: Infinity,
    child: innerChild,
  });
}
