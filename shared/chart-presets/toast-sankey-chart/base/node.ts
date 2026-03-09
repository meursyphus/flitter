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
  Opacity,
  Radius,
} from "flitter-core";
import { HoverTooltip } from "flitter-ui/chart";
import { agTooltipContent, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";

export function Node(
  ...[{ id, label, color, x, y, width, height }, ctx]: Parameters<SankeyChartCustom["node"]>
) {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const nodeValue =
    ctx.layout.nodes.find((node) => node.id === id)?.totalValue ?? Math.round(height * 100);
  const hoveredLink = ctx.hoveredLink;
  const relatedToHoveredLink =
    hoveredLink != null &&
    (hoveredLink.source === id || hoveredLink.target === id);
  const hasLinkHover = hoveredLink != null;

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
            items: { legend: "Node", color, value: nodeValue },
            config: defaultAgCartesianBaseConfig,
          }),
          onMouseEnter: () => ctx.hoverNode(id),
          onMouseLeave: () => ctx.unhoverNode(),
          renderChild: (hovered) =>
            Opacity({
              opacity: hasLinkHover ? (relatedToHoveredLink ? 1 : 0.28) : 1,
              child: Container({
                width: Infinity,
                height: Infinity,
                decoration: new BoxDecoration({
                  color,
                  borderRadius: BorderRadius.all(Radius.circular(2)),
                  border:
                    hovered || relatedToHoveredLink
                      ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                      : undefined,
                  boxShadow: hovered || relatedToHoveredLink
                    ? [new BoxShadow({ color: "rgba(0,0,0,0.18)", blurRadius: 10 })]
                    : undefined,
                }),
              }),
            }),
        }),
      }),
    }),
  });
}
