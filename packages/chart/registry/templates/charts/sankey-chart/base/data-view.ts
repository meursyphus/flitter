import type { SankeyChartCustom } from "../types";
import { LayoutBuilder, Positioned, Stack, StackFit } from "flitter-core";

export function DataView(
  ...[{ nodes, links }]: Parameters<SankeyChartCustom["dataView"]>
) {
  return LayoutBuilder({
    builder: (_, constraints) =>
      Stack({
        fit: StackFit.expand,
        clipped: false,
        children: [
          ...links.map((link) => Positioned.fill({ child: link })),
          ...nodes.map((node) =>
            Positioned({
              key: node.id,
              left: node.x * constraints.maxWidth,
              top: node.top * constraints.maxHeight,
              width: node.width * constraints.maxWidth,
              height: node.height * constraints.maxHeight,
              child: node.widget,
            }),
          ),
        ],
      }),
  });
}
