import type { SankeyChartCustom } from "../types";
import {
  Align,
  Alignment,
  Border,
  BorderRadius,
  BoxDecoration,
  BoxShadow,
  Container,
  FractionallySizedBox,
  Radius,
} from "flitter-core";
import { HoverTooltip } from "@shared/interaction/hover-tooltip";
import { agTooltipContent, defaultAgCartesianBaseConfig } from "@styles/ag";

export function Node(
  ...[{ label, color, x, y, width, height }]: Parameters<SankeyChartCustom["node"]>
) {
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  return Container({
    width: Infinity,
    height: Infinity,
    child: Align({
      alignment: new Alignment({
        x: centerX * 2 - 1,
        y: centerY * 2 - 1,
      }),
      child: FractionallySizedBox({
        widthFactor: width,
        heightFactor: height,
        child: new HoverTooltip({
          position: "topCenter",
          tooltip: agTooltipContent({
            label,
            items: { legend: "Node", color, value: Math.round(height * 100) },
            config: defaultAgCartesianBaseConfig,
          }),
          renderChild: (hovered) =>
            Container({
              width: Infinity,
              height: Infinity,
              decoration: new BoxDecoration({
                color,
                borderRadius: BorderRadius.all(Radius.circular(2)),
                border:
                  hovered
                    ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                    : undefined,
                boxShadow: hovered
                  ? [new BoxShadow({ color: "rgba(0,0,0,0.18)", blurRadius: 10 })]
                  : undefined,
              }),
            }),
        }),
      }),
    }),
  });
}
