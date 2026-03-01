import { Column, Flexible, Row } from "flitter-core";
import type { HeatmapCustom } from "../types";

export function Heatmap(
  ...[{ segments },]: Parameters<HeatmapCustom["heatmap"]>
) {
  const rows = segments.map((row) => {
    return Row({
      children: row.map((segment) =>
        Flexible({
          flex: 1,
          child: segment,
        }),
      ),
    });
  });

  return Column({
    children: rows.map((row) => Flexible({ flex: 1, child: row })),
  });
}
