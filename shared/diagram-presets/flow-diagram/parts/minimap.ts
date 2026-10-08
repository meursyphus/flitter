import {
  type BuildContext,
  GestureDetector,
  StatelessWidget,
  type Widget,
} from "flitter-ui";
import { FlowProvider } from "flitter-ui/diagram";
import { type Rect, getBoundsOfRects } from "flitter-ui/diagram";
import type { XyflowFlowConfig } from "../config";
import { ShapePaint, rectPathD } from "./paint";

/** Overview of all nodes with a mask showing the current viewport, like React Flow's `<MiniMap>`. */
class XyflowMiniMapWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = FlowProvider.of<XyflowFlowConfig>(context);
    const { colors, minimap } = ctx.config;
    const elementWidth = minimap.width;
    const elementHeight = minimap.height;
    const viewBB = ctx.getViewportRect();
    const nodeRects: { rect: Rect; id: string }[] = [];
    for (const node of ctx.getVisibleNodes()) {
      const rect = ctx.getNodeRect(node);
      if (rect) nodeRects.push({ rect, id: node.id });
    }
    const boundingRect = nodeRects.length > 0 ? getBoundsOfRects([...nodeRects.map((n) => n.rect), viewBB]) : viewBB;
    const scaledWidth = boundingRect.width / elementWidth;
    const scaledHeight = boundingRect.height / elementHeight;
    const viewScale = Math.max(scaledWidth, scaledHeight) || 1;
    const viewWidth = viewScale * elementWidth;
    const viewHeight = viewScale * elementHeight;
    const offset = minimap.offsetScale * viewScale;
    const x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
    const y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
    const width = viewWidth + offset * 2;
    const height = viewHeight + offset * 2;
    const scale = elementWidth / width;
    const toLocal = (value: number, origin: number) => (value - origin) * scale;
    const nodesD = nodeRects
      .map(({ rect }) =>
        rectPathD(
          toLocal(rect.x, x),
          toLocal(rect.y, y),
          rect.width * scale,
          rect.height * scale,
          minimap.nodeBorderRadius * scale,
        ),
      )
      .join("");
    const maskD =
      rectPathD(toLocal(x - offset, x), toLocal(y - offset, y), (width + offset * 2) * scale, (height + offset * 2) * scale) +
      rectPathD(toLocal(viewBB.x, x), toLocal(viewBB.y, y), viewBB.width * scale, viewBB.height * scale);

    const paint = ShapePaint({
      width: elementWidth,
      height: elementHeight,
      shapes: {
        background: { d: rectPathD(0, 0, elementWidth, elementHeight), fill: colors.minimapBackground },
        nodes: nodesD ? { d: nodesD, fill: minimap.nodeColor ?? colors.minimapNode } : null,
        mask: {
          d: maskD,
          fill: minimap.maskColor ?? colors.minimapMask,
          stroke: colors.minimapViewportStroke,
          strokeWidth: 1,
        },
      },
    });
    let last: { x: number; y: number } | null = null;
    return GestureDetector({
      cursor: minimap.pannable ? "grab" : "default",
      behavior: "opaque",
      onMouseDown: (event) => event.stopPropagation(),
      onClick: (event) => event.stopPropagation(),
      onDragStart: (event) => {
        event.stopPropagation();
        last = { x: event.clientX, y: event.clientY };
      },
      onDragMove: (event) => {
        if (!minimap.pannable || !last) return;
        const dx = event.clientX - last.x;
        const dy = event.clientY - last.y;
        last = { x: event.clientX, y: event.clientY };
        const zoom = Math.max(1, ctx.viewport.zoom);
        ctx.panBy({ x: -dx * viewScale * zoom, y: -dy * viewScale * zoom });
      },
      onDragEnd: () => {
        last = null;
      },
      child: paint,
    });
  }
}

export function XyflowMiniMap(): Widget {
  return new XyflowMiniMapWidget();
}
