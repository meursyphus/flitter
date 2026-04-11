import type { SankeyChartCustom } from "../types";
import { Text, TextStyle } from "flitter-ui";

export function NodeLabel(
  ...[{ label }, ctx]: Parameters<SankeyChartCustom["nodeLabel"]>
) {
  return Text(label, {
    style: new TextStyle({
      fontFamily: ctx.config.font.family,
      fontSize: 13,
      fontWeight: "500",
      color: "#1f1f1f",
    }),
  });
}
