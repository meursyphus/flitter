import type { SankeyChartCustom } from "../types";
import {
  Align,
  Alignment,
  FractionallySizedBox,
  Positioned,
  Stack,
  StackFit,
} from "flitter-ui";

export function DataView(
  ...[{ nodes, links }]: Parameters<SankeyChartCustom["dataView"]>
) {
  return Stack({
    fit: StackFit.expand,
    clipped: false,
    children: [
      ...links.map((link) => Positioned.fill({ child: link })),
      ...nodes.map((node) =>
        Positioned.fill({
          child: Align({
            alignment: new Alignment({
              x: (node.x + node.width / 2) * 2 - 1,
              y: (node.top + node.height / 2) * 2 - 1,
            }),
            child: FractionallySizedBox({
              widthFactor: node.width,
              heightFactor: node.height,
              child: node.widget,
            }),
          }),
        }),
      ),
    ],
  });
}
