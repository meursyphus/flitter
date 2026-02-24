import type { RadarChartCustom } from "../types";
import { Text, type Widget } from "flitter-core";

export function Title(
  ...[{ name }]: Parameters<RadarChartCustom["title"]>
): Widget {
  return Text(name);
}
