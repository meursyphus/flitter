import type { LineChartCustom } from "flitter-ui/chart";
import { Positioned, Stack } from "flitter-core";

export function DataView(...[{ lines }]: Parameters<LineChartCustom["dataView"]>) {
  return Stack({
    children: lines.map((line) =>
      Positioned.fill({
        child: line,
      }),
    ),
  });
}
