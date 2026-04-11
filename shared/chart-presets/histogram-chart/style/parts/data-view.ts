import {
  Axis,
  Container,
  Flex,
  Flexible,
  type Widget,
} from "flitter-ui";
import type { HistogramChartCustom } from "flitter-ui/chart";
import type { HistogramChartConfig } from "../config";

export function agDataView(
  ...[{ bars }, ctx]: Parameters<HistogramChartCustom<HistogramChartConfig>["dataView"]>
): Widget {
  return Container({
    width: Infinity,
    height: Infinity,
    child: Flex({
      direction: Axis.horizontal,
      children: bars.map((bar) =>
        Flexible({
          flex: 1,
          child: bar,
        }),
      ),
    }),
  });
}
