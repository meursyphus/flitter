import {
  GlobalKey,
  type ChangeNotifier,
  type Element,
  type RenderObject,
  type Widget,
} from "flitter-core";

type Controller = ChangeNotifier & {
  custom: Record<string, (...args: any[]) => Widget>;
  [key: string]: any;
};
type Mark = { id: string; slot: string; args: any; widget: Widget };

function identity(slot: string, args: any): string {
  if (slot === "node") return `node:${args.id}`;
  if (slot === "link") return `link:${args.source}:${args.target}`;
  if (slot === "segment") return `segment:${args.key}`;
  if (slot === "stage") return `stage:${args.index}`;
  if (slot === "boxPlot") return `box:${args.index}:${args.legend}`;
  if (slot === "outlier")
    return `outlier:${args.index}:${args.legend}:${args.value}`;
  if (slot === "bulletGroup") return `bullet:${args.index}`;
  return `${slot}:${args?.index ?? ""}`;
}

/** Observe the original gallery widget; do not add layout or hit-test wrappers. */
export function observeGallery(
  widget: Widget,
  slug: string,
  showLegend = false,
): Widget {
  const rootKey = new GlobalKey();
  widget.key = rootKey;
  const provider = widget as Widget & { create: () => Controller };
  const create = provider.create.bind(provider);
  provider.create = () => {
    const controller = create();
    if (showLegend && controller.config.legend)
      controller.config.legend.visible = true;
    const marks = new Map<string, Mark>();
    let tooltipVisible = false;
    let tooltipWidget: Widget | null = null;
    const slots = new Set([
      "node",
      "link",
      "segment",
      "stage",
      "bar",
      "boxPlot",
      "outlier",
      "bulletGroup",
      "legend",
      "tooltip",
    ]);
    for (const [slot, builder] of Object.entries(controller.custom)) {
      if (slot !== "tooltipArea" && !slots.has(slot)) continue;
      controller.custom[slot] = (args, context) => {
        const child = builder(args, context);
        if (slot === "tooltipArea") tooltipVisible = args.tooltip != null;
        else if (slot === "tooltip") tooltipWidget = child;
        else
          marks.set(identity(slot, args), {
            id: identity(slot, args),
            slot,
            args,
            widget: child,
          });
        return child;
      };
    }
    Object.assign(window, {
      __galleryAudit: {
        slug,
        controller,
        hover: () => {
          const c = controller;
          if (slug.startsWith("sankey"))
            return c.hoveredNodeId != null
              ? `node:${c.hoveredNodeId}`
              : c.hoveredLink
                ? `link:${c.hoveredLink.source}:${c.hoveredLink.target}`
                : null;
          if (slug.startsWith("sunburst"))
            return c.hoveredSegmentKey == null
              ? null
              : `segment:${c.hoveredSegmentKey}`;
          if (slug.startsWith("funnel"))
            return c.hoveredIndex == null ? null : `stage:${c.hoveredIndex}`;
          if (slug.startsWith("box-plot")) {
            const h = c.hoveredBoxPlot;
            return h == null
              ? null
              : h.kind === "outlier"
                ? `outlier:${h.index}:${h.legend}:${h.value}`
                : `box:${h.index}:${h.legend}`;
          }
          const h = c.hoveredBullet ?? c.hoveredBin ?? c.hoveredBar;
          return h == null
            ? null
            : `${slug.startsWith("bullet") ? "bullet" : "bar"}:${h.index}`;
        },
        hasTooltip: () => tooltipVisible,
        tooltipBounds: () => {
          const root = rootKey.buildOwner?.findByGlobalKey(rootKey);
          if (!root || !tooltipWidget || !tooltipVisible) return null;
          let object: RenderObject | null = null;
          const visit = (element: Element) => {
            if (element.widget === tooltipWidget) object = element.renderObject;
            else element.visitChildren(visit);
          };
          visit(root);
          if (object == null) return null;
          const render = object as RenderObject;
          const offset = render.localToGlobal();
          return {
            x: offset.x,
            y: offset.y,
            width: render.size.width,
            height: render.size.height,
          };
        },
        marks: () => {
          const root = rootKey.buildOwner?.findByGlobalKey(rootKey);
          if (!root) return [];
          const elements = new Map<Widget, Element>();
          const visit = (element: Element) => {
            elements.set(element.widget, element);
            element.visitChildren(visit);
          };
          visit(root);
          return [...marks.values()].flatMap((mark) => {
            const element = elements.get(mark.widget);
            if (!element) return [];
            const object = element.renderObject;
            const geometries: SVGGeometryElement[] = [];
            const collect = (node: RenderObject) => {
              if (node.isPainter)
                geometries.push(
                  ...node.svgPainter.domNode.querySelectorAll<SVGGeometryElement>(
                    "path,rect,circle,ellipse,polygon",
                  ),
                );
              node.visitChildren(collect);
            };
            collect(object);
            const offset = object.localToGlobal();
            return [
              {
                id: mark.id,
                slot: mark.slot,
                geometries,
                rect: {
                  x: offset.x,
                  y: offset.y,
                  width: object.size.width,
                  height: object.size.height,
                },
                name: mark.args.name,
              },
            ];
          });
        },
      },
    });
    return controller;
  };
  return widget;
}
