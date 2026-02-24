import type { FunnelChartCustom } from "../types";
import { Column, CrossAxisAlignment, type Widget } from "flitter-core";

export function Funnel(
  ...[{ stages }]: Parameters<FunnelChartCustom["funnel"]>
): Widget {
  return Column({
    crossAxisAlignment: CrossAxisAlignment.center,
    children: stages,
  });
}
