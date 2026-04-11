import type { BarChartCustom } from "flitter-ui/chart";
import { Axis, Container, Flex, Flexible } from "flitter-ui";

export function DataView(...[{ barGroups }, { direction }]: Parameters<BarChartCustom["dataView"]>) {
  return Container({
    height: Infinity,
    width: Infinity,
    child: Flex({
      direction: direction === "vertical" ? Axis.horizontal : Axis.vertical,
      children: barGroups.map((barGroup) =>
        Flexible({
          flex: 1,
          child: barGroup,
        }),
      ),
    }),
  });
}
