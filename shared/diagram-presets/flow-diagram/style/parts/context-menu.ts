import {
  Border,
  BorderRadius,
  BoxShadow,
  BoxDecoration,
  Column,
  Container,
  EdgeInsets,
  MainAxisSize,
  Text,
  TextStyle,
  type Widget,
} from "flitter-ui";
import type {
  ContextMenuCustomArgs,
  ActionCustomArgs,
  FlowDiagramContext,
} from "flitter-ui/diagram";
import type { DefaultFlowConfig } from "../config";

export function defaultContextMenu(
  args: ContextMenuCustomArgs & ActionCustomArgs,
  ctx: FlowDiagramContext<DefaultFlowConfig>,
): Widget {
  const { colors, contextMenu } = ctx.config;
  const node = args.ids.length === 1 ? ctx.getNode(args.ids[0]) : undefined;
  const items = ctx.config.contextMenu.items?.(args, ctx) ?? [
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
      onSelect: () => void ctx.copy(),
    },
    ...(args.target === "pane"
      ? [
          {
            label: "Paste",
            disabled: !ctx.interaction.clipboard.enabled,
            onSelect: () => void ctx.paste(),
          },
        ]
      : []),
    {
      label: "Delete",
      disabled: args.ids.length === 0,
      onSelect: () =>
        void ctx.deleteElements({
          nodes: args.ids
            .filter((id) => args.target !== "edge" && ctx.getNode(id))
            .map((id) => ({ id })),
          edges: args.ids
            .filter((id) => args.target !== "node" && ctx.getEdge(id))
            .map((id) => ({ id })),
        }),
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
    { label: "Fit view", onSelect: () => void ctx.fitView() },
  ];
  return Container({
    width: 180,
    padding: EdgeInsets.all(4),
    decoration: new BoxDecoration({
      color: colors.nodeBackground,
      borderRadius: BorderRadius.circular(contextMenu.borderRadius),
      boxShadow: [
        new BoxShadow({
          color: contextMenu.shadowColor,
          offset: { x: 0, y: contextMenu.shadowOffsetY },
          blurRadius: contextMenu.shadowBlur,
        }),
      ],
      border: Border.all({ color: colors.nodeBorder, width: 1 }),
    }),
    child: Column({
      mainAxisSize: MainAxisSize.min,
      children: items.map((item) =>
        args.action(
          (isHovered) => menuItem(item, ctx, isHovered),
          () => {
            ctx.closeContextMenu();
            item.onSelect();
          },
          item.disabled,
        ),
      ),
    }),
  });
}

type MenuEntry = {
  label: string;
  onSelect(): void;
  disabled?: boolean;
  separator?: boolean;
};
function menuItem(
  item: MenuEntry,
  ctx: FlowDiagramContext<DefaultFlowConfig>,
  isHovered: boolean,
): Widget {
  const { colors, node, contextMenu } = ctx.config;
  return Container({
    width: 170,
    padding: EdgeInsets.symmetric({ horizontal: 8, vertical: 6 }),
    decoration: new BoxDecoration({
      color:
        isHovered && !item.disabled
          ? colors.controlsBackgroundHover
          : colors.nodeBackground,
      borderRadius: BorderRadius.circular(contextMenu.itemBorderRadius),
      border: item.separator
        ? Border.all({ color: colors.controlsBorder, width: 1 })
        : undefined,
    }),
    child: Text(item.label, {
      style: new TextStyle({
        fontFamily: contextMenu.fontFamily ?? node.fontFamily,
        fontSize: contextMenu.fontSize ?? node.fontSize,
        color: item.disabled ? colors.patternDots : colors.nodeColor,
      }),
    }),
  });
}
