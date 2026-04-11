import { Column, Flexible, Row } from "flitter-core";
import type { HeatmapCustom } from "@headless/heatmap-chart/types";

export function DataView(
  ...[{ segments }]: Parameters<HeatmapCustom["dataView"]>
) {
  return Column({
    children: segments.map((row) =>
      Flexible({
        flex: 1,
        child: Row({
          children: row.map((segment) =>
            Flexible({ flex: 1, child: segment }),
          ),
        }),
      }),
    ),
  });
}
