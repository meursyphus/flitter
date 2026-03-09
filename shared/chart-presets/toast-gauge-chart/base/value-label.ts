import type { GaugeChartCustom } from "../types";
import {
  Text,
  TextStyle,
  Container,
  EdgeInsets,
} from "flitter-core";

export function ValueLabel(
  ...[{ value }]: Parameters<GaugeChartCustom["valueLabel"]>
) {
  return Container({
    padding: EdgeInsets.only({ top: 8 }),
    child: Text(value.toString(), {
      style: new TextStyle({
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
      }),
    }),
  });
}
