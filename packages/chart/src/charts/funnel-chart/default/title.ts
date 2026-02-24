import type { FunnelChartCustom } from "../types";
import { Text, type Widget } from "flitter-core";

export function Title(
  ...[{ name }]: Parameters<FunnelChartCustom["title"]>
): Widget {
  return Text(name);
}
