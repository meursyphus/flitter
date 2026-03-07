import type { SankeyChartCustom } from "../types";
import {
  Stack,
  Positioned,
  SizedBox,
  Flexible,
  Column,
} from "flitter-core";

export function Sankey(
  ...[{ nodes, links, nodeLabels }]: Parameters<SankeyChartCustom["sankey"]>
) {
  return Column({
    children: [
      Flexible({
        flex: 1,
        child: Stack({
          children: [
            // Links go first (behind nodes)
            ...links.map((link) => Positioned.fill({ child: link })),
            // Nodes on top
            ...nodes.map((node) => Positioned.fill({ child: node })),
            // Labels on top of everything
            ...nodeLabels.map((label) => Positioned.fill({ child: label })),
          ],
        }),
      }),
    ],
  });
}
