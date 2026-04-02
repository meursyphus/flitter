import {
  Axis,
  Flex,
  Flexible,
  Positioned,
  Stack,
  type Widget,
} from "flitter-core";
import type { WaterfallChartCustom } from "flitter-ui/chart";
import type { WaterfallChartConfig } from "../config";

export function agDataView(
  ...[{ bars, connectors }]: Parameters<WaterfallChartCustom<WaterfallChartConfig>["dataView"]>
): Widget {
  return Stack({
    children: [
      ...connectors.map((connector) => Positioned.fill({ child: connector })),
      Positioned.fill({
        child: Flex({
          direction: Axis.horizontal,
          children: bars.map((bar) =>
            Flexible({
              flex: 1,
              child: bar,
            }),
          ),
        }),
      }),
    ],
  });
}
