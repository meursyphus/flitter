import type { FunnelChartCustom } from "../types";
import { Column, Container, CrossAxisAlignment, type Widget } from "flitter-core";

export function Funnel(
  ...[{ stages }]: Parameters<FunnelChartCustom["funnel"]>
): Widget {
  return Container({
    width: Infinity,
    child: Column({
      crossAxisAlignment: CrossAxisAlignment.center,
      children: stages,
    }),
  });
}
