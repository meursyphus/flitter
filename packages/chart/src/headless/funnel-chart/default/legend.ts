import type { FunnelChartCustom } from "../types";
import {
  Container,
  EdgeInsets,
  Padding,
  Row,
  Text,
  TextStyle,
  type Widget,
} from "flitter-core";

export function Legend(
  ...[{ label, color }]: Parameters<FunnelChartCustom["legend"]>
): Widget {
  return Padding({
    padding: EdgeInsets.only({ right: 12 }),
    child: Row({
      children: [
        Container({
          width: 12,
          height: 12,
          color,
          margin: EdgeInsets.only({ right: 4 }),
        }),
        Text(label, {
          style: new TextStyle({
            fontSize: 12,
          }),
        }),
      ],
    }),
  });
}
