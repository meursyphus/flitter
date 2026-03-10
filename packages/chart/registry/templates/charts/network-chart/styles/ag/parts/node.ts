import {
  Align,
  Alignment,
  Border,
  BoxDecoration,
  BoxShadow,
  Container,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { NetworkChartCustom } from "@headless/network-chart/types";
import { HoverTooltip } from "@shared/interaction/hover-tooltip";
import { agTooltipContent } from "@styles/ag";
import type { NetworkChartConfig } from "../config";

export function agNode(
  { label, x, y, size, group, index }: Parameters<NetworkChartCustom<NetworkChartConfig>["node"]>[0],
  ctx: Parameters<NetworkChartCustom<NetworkChartConfig>["node"]>[1],
): Widget {
  const diameter = 20 + size * 8;
  const fill = ctx.config.colors.fills[index % ctx.config.colors.fills.length];

  return Align({
    alignment: new Alignment({ x: x * 2 - 1, y: y * 2 - 1 }),
    child: new HoverTooltip({
      position: "topCenter",
      tooltip: agTooltipContent({
        label,
        items: {
          legend: group ?? "Node size",
          color: fill,
          value: size,
        },
        config: ctx.config as any,
      }),
      renderChild: (hovered) =>
        SizedBox({
          width: diameter,
          height: diameter,
          child: Container({
            width: Infinity,
            height: Infinity,
            decoration: new BoxDecoration({
              color: fill,
              shape: "circle",
              border:
                hovered
                  ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                  : undefined,
              boxShadow: hovered
                ? [new BoxShadow({ color: "rgba(0,0,0,0.18)", blurRadius: 12 })]
                : undefined,
            }),
          }),
        }),
    }),
  });
}
