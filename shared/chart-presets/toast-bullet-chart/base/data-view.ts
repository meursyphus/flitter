import type { BulletChartCustom } from "flitter-ui/chart";
import { Axis, Container, Flex, Flexible } from "flitter-core";

export function BulletDataView(...[{ bulletGroups }, { direction }]: Parameters<BulletChartCustom["dataView"]>) {
  return Container({
    height: Infinity,
    width: Infinity,
    child: Flex({
      direction: direction === "vertical" ? Axis.horizontal : Axis.vertical,
      children: bulletGroups.map((bulletGroup) =>
        Flexible({
          flex: 1,
          child: bulletGroup,
        }),
      ),
    }),
  });
}
