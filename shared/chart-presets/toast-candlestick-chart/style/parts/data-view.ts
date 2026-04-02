import {
  Axis,
  Container,
  Flex,
  Flexible,
  type Widget,
} from "flitter-core";
import type { CandlestickChartCustom } from "flitter-ui/chart";
import type { CandlestickChartConfig } from "../config";
import { AnimatedDataView } from "../../../_styles/toast/cartesian/animated-data-view";

export function toastDataView(
  ...[args, context]: Parameters<CandlestickChartCustom<CandlestickChartConfig>["dataView"]>
): Widget {
  const child = Container({
    width: Infinity,
    height: Infinity,
    child: Flex({
      direction: Axis.horizontal,
      children: args.candlestickGroups.map(({ candlesticks }) =>
        Flexible({
          flex: 1,
          child: Flex({
            direction: Axis.horizontal,
            children: candlesticks.map((candlestick) =>
              Flexible({
                flex: 1,
                child: candlestick,
              }),
            ),
          }),
        }),
      ),
    }),
  });

  const scale = context.scale;
  const baselineRatio =
    scale ? Math.max(0, Math.min(1, (0 - scale.min) / (scale.max - scale.min))) : 0;

  return new AnimatedDataView({
    child,
    duration: context.config.animation.duration,
    isVertical: true,
    baselineRatio,
  });
}
