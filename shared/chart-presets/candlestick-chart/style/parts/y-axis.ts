import {
  Column,
  CrossAxisAlignment,
  FractionalTranslation,
  MainAxisAlignment,
  MainAxisSize,
  Offset,
  Row,
  SizedBox,
  VerticalDirection,
  type Widget,
} from "flitter-ui";
import type { CandlestickChartCustom } from "flitter-ui/chart";
import type { CandlestickChartConfig } from "../config";
import { IgnoreSize } from "flitter-ui/chart";

export function agRightYAxis(
  ...[{ line, labels, tick }, ctx]: Parameters<
    CandlestickChartCustom<CandlestickChartConfig>["yAxis"]
  >
): Widget {
  const tickCount = labels.length;
  const gap = ctx.config.axis.label.gap;

  return Row({
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.end,
    children: [
      line,
      Column({
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: Array.from({ length: tickCount }, (_, index) =>
          FractionalTranslation({
            translation: new Offset({
              x: 0,
              y: index === tickCount - 1 ? 1 : 0,
            }),
            child: tick,
          }),
        ),
      }),
      ...(gap > 0 ? [SizedBox({ width: gap })] : []),
      Column({
        crossAxisAlignment: CrossAxisAlignment.start,
        verticalDirection: VerticalDirection.up,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: labels.map((child) =>
          IgnoreSize({ child, ignoreHeight: true }),
        ),
      }),
    ],
  });
}
