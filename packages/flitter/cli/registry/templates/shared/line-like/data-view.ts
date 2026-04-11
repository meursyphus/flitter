import type { LineChartCustom } from "@headless/line-chart/types";
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
