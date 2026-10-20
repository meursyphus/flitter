import type { LineChartCustom } from "@flitterjs/chart";
import { Positioned, Stack } from "flitterjs";

export function DataView(...[{ lines }]: Parameters<LineChartCustom["dataView"]>) {
  return Stack({
    children: lines.map((line) =>
      Positioned.fill({
        child: line,
      }),
    ),
  });
}
