import type { FunnelChartCustom } from "../types";
import {
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
} from "flitter-core";

export function Layout(
  ...[{ title, funnel }]: Parameters<FunnelChartCustom["layout"]>
) {
  return Container({
    padding: EdgeInsets.all(20),
    child: Column({
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        title,
        funnel,
      ],
    }),
  });
}
