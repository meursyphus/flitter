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
import type { BarChartCustom } from "../bar-chart/headless";

export function stackedBarGroup(
  ...[{ bars }, ctx]: Parameters<BarChartCustom['barGroup']>
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
      const ratio = Math.abs(value) / total;
      return ctx.custom.barBox({ bar, value, ratio, alignment: baseAlignment, index: datasetIndex }, ctx);
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
    innerChild = FractionallySizedBox({
      alignment,
      widthFactor: isVertical ? 0.6 : undefined,
      heightFactor: isVertical ? undefined : 0.6,
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

    const positiveChild =
      positiveValues.length > 0
        ? buildStack(positiveValues, positiveAlignment)
        : SizedBox.shrink();
    const negativeChild =
      negativeValues.length > 0
        ? buildStack(negativeValues, negativeAlignment)
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
