import type { FunnelChartCustom } from "../types";
import { Text, TextStyle, type Widget } from "flitter-core";

export function StageLabel(
  ...[{ label }]: Parameters<FunnelChartCustom["stageLabel"]>
): Widget {
  return Text(label, {
    style: new TextStyle({
      fontSize: 13,
      fontWeight: "bold",
      color: "white",
    }),
  });
}
