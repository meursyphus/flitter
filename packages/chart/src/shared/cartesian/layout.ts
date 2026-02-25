import type { CartesianCustom } from "./types";
import {
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  Expanded,
  MainAxisAlignment,
  MainAxisSize,
  Row,
  type Widget,
} from "flitter-core";

export function Layout(
  ...[{ title, legends, plot }]: Parameters<CartesianCustom["layout"]>
): Widget {
  return Container({
    padding: EdgeInsets.only({
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
        Expanded({ child: plot }),
      ],
    }),
  });
}
