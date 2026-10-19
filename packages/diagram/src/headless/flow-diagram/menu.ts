import type { GetContextMenuItemsFn } from "./types";

export const getDefaultContextMenuItems: GetContextMenuItemsFn<any> = (
  args,
  ctx,
) => {
  const node = args.ids.length === 1 ? ctx.getNode(args.ids[0]) : undefined;
  return [
    {
      label: "Duplicate",
      disabled: !args.ids.length || !ctx.interaction.clipboard.enabled,
      onSelect: () => {
        ctx.duplicate(args.ids);
      },
    },
    {
      label: "Copy",
      disabled: !args.ids.length || !ctx.interaction.clipboard.enabled,
      onSelect: () => {
        void ctx.copy();
      },
    },
    ...(args.target === "pane"
      ? [
          {
            label: "Paste",
            disabled: !ctx.interaction.clipboard.enabled,
            onSelect: () => {
              void ctx.paste();
            },
          },
        ]
      : []),
    {
      label: "Delete",
      disabled: args.ids.length === 0,
      onSelect: () => {
        void ctx.deleteElements({
          nodes: args.ids
            .filter((id) => args.target !== "edge" && ctx.getNode(id))
            .map((id) => ({ id })),
          edges: args.ids
            .filter((id) => args.target !== "node" && ctx.getEdge(id))
            .map((id) => ({ id })),
        });
      },
    },
    {
      label: "Bring to front",
      disabled: args.ids.length === 0,
      onSelect: () => ctx.bringToFront(args.ids),
    },
    ...(node?.collapsible
      ? [
          {
            label: node.collapsed ? "Expand" : "Collapse",
            onSelect: () => ctx.toggleCollapsed(node.id),
          },
        ]
      : []),
    {
      label: "Fit view",
      onSelect: () => {
        void ctx.fitView();
      },
    },
  ];
};
