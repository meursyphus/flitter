import { Column, Flexible, Row } from "flitter-core";
import type { HeatmapCustom } from "flitter-ui/chart";

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
