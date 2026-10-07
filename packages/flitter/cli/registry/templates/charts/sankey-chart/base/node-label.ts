import type { SankeyChartCustom } from "../types";
import { Text, TextStyle } from "flitter-core";

export function NodeLabel(
  ...[{ label }, ctx]: Parameters<SankeyChartCustom["nodeLabel"]>
) {
  return Text(label, {
    style: new TextStyle({
      fontFamily: ctx.config.font.family,
      fontSize: ctx.config.sankey.labelFontSize,
      fontWeight: "500",
      color: ctx.config.sankey.labelColor,
    }),
  });
}
