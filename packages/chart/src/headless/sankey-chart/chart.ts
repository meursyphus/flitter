import {
  CustomPaint,
  FractionallySizedBox,
  GestureDetector,
  GlobalKey,
  Align,
  Alignment,
  Positioned,
  SizedBox,
  Stack,
  StackFit,
  StatelessWidget,
  StatefulWidget,
  State,
  type Widget,
  type BuildContext,
} from "flitter-core";
import { resolveOverlayRect } from "@headless/_shared/cartesian-scaffold";
import { SankeyChartProvider } from "./provider";
import { createRibbonPolygon, isPointInPolygon } from "./geometry";
import type {
  SankeyHoveredRect,
  SankeyLinkLayout,
  SankeyNodeLayout,
  SankeyPlacedNode,
} from "./types";

class SankeyChart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new LayoutWidget();
  }
}

export default SankeyChart;

class LayoutWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = SankeyChartProvider.of(context);
    return ctx.custom.layout(
      {
        title: new TitleWidget(),
        dataView: new SankeyWidget(),
        tooltipArea: new TooltipArea(),
      },
      ctx,
    );
  }
}

class TitleWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = SankeyChartProvider.of(context);
    return ctx.custom.title(undefined, ctx);
  }
}

class SankeyWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = SankeyChartProvider.of(context);
    const sankeyLayout = ctx.layout;

    const nodes: SankeyPlacedNode[] = sankeyLayout.nodes.map((node) => ({
      id: node.id,
      column: node.column,
      x: node.x,
      width: node.width,
      top: node.top,
      height: node.height,
      widget: new NodeWidget(node),
    }));

    const links = sankeyLayout.links.map((link) => new LinkWidget(link));

    return GestureDetector({
      behavior: "translucent",
      onMouseLeave: () => ctx.unhoverAll(),
      child: ctx.custom.dataView({ nodes, links }, ctx),
    });
  }
}

class TooltipArea extends StatefulWidget {
  createState() {
    return new TooltipAreaState();
  }
}

class TooltipAreaState extends State<TooltipArea> {
  overlayKey = new GlobalKey();

  override build(context: BuildContext): Widget {
    const ctx = SankeyChartProvider.of(context);
    const hovered = this.resolveHoveredRect(context);
    const tooltip =
      hovered == null
        ? null
        : hovered.kind === "node"
          ? ctx.custom.tooltip(
              {
                label: hovered.label,
                items: [
                  {
                    legend: "Node",
                    color: hovered.color,
                    value: hovered.value,
                  },
                ],
              },
              ctx,
            )
          : ctx.custom.tooltip(
              {
                label: `${hovered.source} → ${hovered.target}`,
                items: [
                  {
                    legend: "Flow",
                    color: hovered.color,
                    value: hovered.value,
                  },
                ],
              },
              ctx,
            );

    return Stack({
      fit: StackFit.expand,
      clipped: false,
      children: [
        SizedBox({
          key: this.overlayKey,
          width: Infinity,
          height: Infinity,
        }),
        ctx.custom.tooltipArea({ tooltip, hovered }, ctx),
      ],
    });
  }

  private resolveHoveredRect(context: BuildContext): SankeyHoveredRect | null {
    const ctx = SankeyChartProvider.of(context);
    const hoveredNode = ctx.hoveredNode;
    const hoveredLink = ctx.hoveredLinkLayout;
    if (hoveredNode == null && hoveredLink == null) return null;
    const anchorKey =
      hoveredNode != null ? ctx.hoveredNodeAnchorKey : ctx.hoveredLinkAnchorKey;
    const rect =
      anchorKey == null ? null : resolveOverlayRect(this.overlayKey, anchorKey);
    if (rect == null) return null;

    if (hoveredNode != null) {
      return {
        kind: "node",
        id: hoveredNode.id,
        label: hoveredNode.label,
        color: hoveredNode.color,
        value: hoveredNode.totalValue,
        ...rect,
      };
    }

    if (hoveredLink != null) {
      return {
        kind: "link",
        source: hoveredLink.source,
        target: hoveredLink.target,
        color: hoveredLink.color,
        value: hoveredLink.value,
        ...rect,
      };
    }

    return null;
  }
}

class NodeWidget extends StatefulWidget {
  #node: SankeyNodeLayout;

  constructor(node: SankeyNodeLayout) {
    super();
    this.#node = node;
  }

  get node(): SankeyNodeLayout {
    return this.#node;
  }

  createState() {
    return new NodeWidgetState();
  }
}

class NodeWidgetState extends State<NodeWidget> {
  anchorKey = new GlobalKey();

  override build(context: BuildContext): Widget {
    const ctx = SankeyChartProvider.of(context);
    const node = this.widget.node;
    const isHovered = ctx.hoveredNodeId === node.id;
    const isActive = ctx.isNodeActive(node.id);
    const isDimmed = ctx.isNodeDimmed(node.id);
    const labelWidget = ctx.custom.nodeLabel(
      {
        id: node.id,
        label: node.label,
        color: node.color,
        value: node.totalValue,
        isHovered,
        isActive,
        isDimmed,
      },
      ctx,
    );

    return GestureDetector({
      key: this.anchorKey,
      cursor: "default",
      onMouseEnter: () => ctx.hoverNode(node.id, this.anchorKey),
      onMouseLeave: () => ctx.unhoverNode(node.id),
      child: ctx.custom.node(
        {
          id: node.id,
          label: node.label,
          color: node.color,
          value: node.totalValue,
          column: node.column,
          totalColumns: ctx.layout.totalColumns,
          labelWidget,
          isHovered,
          isActive,
          isDimmed,
        },
        ctx,
      ),
    });
  }
}

class LinkWidget extends StatefulWidget {
  #link: SankeyLinkLayout;

  constructor(link: SankeyLinkLayout) {
    super();
    this.#link = link;
  }

  get link(): SankeyLinkLayout {
    return this.#link;
  }

  createState() {
    return new LinkWidgetState();
  }
}

class LinkWidgetState extends State<LinkWidget> {
  anchorKey = new GlobalKey();

  override build(context: BuildContext): Widget {
    const ctx = SankeyChartProvider.of(context);
    const link = this.widget.link;
    const isHovered = ctx.isLinkHovered(link.source, link.target);
    const isActive = ctx.isLinkActive(link.source, link.target);
    const isDimmed = ctx.isLinkDimmed(link.source, link.target);
    const labelWidget = ctx.custom.linkLabel(
      {
        source: link.source,
        target: link.target,
        value: link.value,
        color: link.color,
        isHovered,
        isActive,
        isDimmed,
      },
      ctx,
    );

    return GestureDetector({
      cursor: "default",
      child: Stack({
        fit: StackFit.expand,
        clipped: false,
        children: [
          CustomPaint({
            painter: {
              hitTest: (position, size) =>
                isPointInPolygon(position, createRibbonPolygon(link, size)),
              svg: {
                createDefaultSvgEl: (paintContext) => ({
                  group: paintContext.createSvgEl("g"),
                }),
                paint: () => {},
              },
              canvas: {
                paint: () => {},
              },
            },
            child: ctx.custom.link(
              {
                source: link.source,
                target: link.target,
                value: link.value,
                color: link.color,
                ribbon: link,
                labelAnchor: {
                  x: link.anchorX + link.anchorWidth / 2,
                  y: link.anchorY + link.anchorHeight / 2,
                },
                labelWidget,
                isHovered,
                isActive,
                isDimmed,
              },
              ctx,
            ),
          }),
          Positioned.fill({
            child: Align({
              alignment: new Alignment({
                x: (link.anchorX + link.anchorWidth / 2) * 2 - 1,
                y: (link.anchorY + link.anchorHeight / 2) * 2 - 1,
              }),
              child: FractionallySizedBox({
                widthFactor: link.anchorWidth,
                heightFactor: link.anchorHeight,
                child: SizedBox({
                  key: this.anchorKey,
                  width: Infinity,
                  height: Infinity,
                }),
              }),
            }),
          }),
        ],
      }),
      onMouseEnter: () => ctx.hoverLink(link.source, link.target, this.anchorKey),
      onMouseLeave: () => ctx.unhoverLink(link.source, link.target),
    });
  }
}
