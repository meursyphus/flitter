import {
  Axis,
  Container,
  Flex,
  Flexible,
  type Widget,
} from "flitter-core";
import type { CandlestickChartCustom } from "@headless/candlestick-chart/types";
import type { CandlestickChartConfig } from "../config";

export function agDataView(
  ...[args, context]: Parameters<CandlestickChartCustom<CandlestickChartConfig>["dataView"]>
): Widget {
  return Container({
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
}
