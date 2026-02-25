import type { RadarChartCustom } from "../types";
import {
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  MainAxisAlignment,
  MainAxisSize,
  Row,
  Expanded,
  AspectRatio,
  Center,
} from "flitter-core";

export function Layout(
  ...[{ title, legends, radar }]: Parameters<RadarChartCustom["layout"]>
) {
  return Container({
    padding: EdgeInsets.all(20),
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
        Expanded({
          child: Center({
            child: AspectRatio({
              aspectRatio: 1,
              child: radar,
            }),
          }),
        }),
      ],
    }),
  });
}
