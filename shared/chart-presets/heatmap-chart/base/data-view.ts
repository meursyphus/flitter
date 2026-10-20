import { Column, Flexible, Row } from "flitterjs";
import type { HeatmapCustom } from "@flitterjs/chart";

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
