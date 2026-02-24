import type { AreaChartCustom } from "../types";
import {
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  MainAxisAlignment,
  MainAxisSize,
  Row,
} from "flitter-core";

export function Layout(
  ...[{ title, legends, plot }, { data }]: Parameters<AreaChartCustom["layout"]>
) {
  return Container({
    padding: EdgeInsets.only({
      left: 20,
      bottom: 60,
      right: 10,
    }),
    child: Column({
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row({
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            title,
            Row({
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: legends,
            }),
          ],
        }),
        plot,
      ],
    }),
  });
}
