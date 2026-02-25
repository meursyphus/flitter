import type { LineChartCustom } from "../types";
import { Stack, Positioned } from "flitter-core";

export function Series(...[{ lines }]: Parameters<LineChartCustom["series"]>) {
  return Stack({
    children: lines.map((line) =>
      Positioned.fill({
        child: line,
      }),
    ),
  });
}
