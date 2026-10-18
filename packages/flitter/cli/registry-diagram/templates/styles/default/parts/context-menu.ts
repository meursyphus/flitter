import {
  Border,
  BorderRadius,
  BoxShadow,
  BoxDecoration,
  Column,
  Container,
  EdgeInsets,
  GestureDetector,
  MainAxisSize,
  State,
  StatefulWidget,
  Text,
  TextStyle,
  type Widget,
} from "flitter-core";
import type { ContextMenuBuilderArgs, FlowContext } from "../../../headless/flow/types";
import type { DefaultFlowConfig } from "../config";

export function defaultContextMenu(args: ContextMenuBuilderArgs, ctx: FlowContext<DefaultFlowConfig>): Widget {
  const { colors } = ctx.config;
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
      ? [{ label: "Paste", disabled: !ctx.interaction.clipboard.enabled, onSelect: () => void ctx.paste() }]
      : []),
    {
      label: "Delete",
      disabled: args.ids.length === 0,
      onSelect: () =>
        void ctx.deleteElements({
          nodes: args.ids.filter((id) => args.target !== "edge" && ctx.getNode(id)).map((id) => ({ id })),
          edges: args.ids.filter((id) => args.target !== "node" && ctx.getEdge(id)).map((id) => ({ id })),
        }),
    },
    { label: "Bring to front", disabled: args.ids.length === 0, onSelect: () => ctx.bringToFront(args.ids) },
    ...(node?.collapsible
      ? [{ label: node.collapsed ? "Expand" : "Collapse", onSelect: () => ctx.toggleCollapsed(node.id) }]
      : []),
    { label: "Fit view", onSelect: () => void ctx.fitView() },
  ];
  return Container({
    width: 180,
    padding: EdgeInsets.all(4),
    decoration: new BoxDecoration({
      color: colors.nodeBackground,
      borderRadius: BorderRadius.circular(4),
      boxShadow: [new BoxShadow({ color: colors.controlsShadow, offset: { x: 0, y: 0 }, blurRadius: 2 })],
      border: Border.all({ color: colors.nodeBorder, width: 1 }),
    }),
    child: Column({
      mainAxisSize: MainAxisSize.min,
      children: items.map((item, index) => new MenuItem(item, ctx, index)),
    }),
  });
}

type MenuEntry = { label: string; onSelect(): void; disabled?: boolean; separator?: boolean };
class MenuItem extends StatefulWidget {
  constructor(
    readonly item: MenuEntry,
    readonly context: FlowContext<DefaultFlowConfig>,
    key: number,
  ) {
    super(key);
  }
  override createState(): State<MenuItem> {
    return new MenuItemState();
  }
}
class MenuItemState extends State<MenuItem> {
  hovered = false;
  override build(): Widget {
    const { item, context: ctx } = this.widget;
    const { colors, node } = ctx.config;
    return GestureDetector({
      cursor: item.disabled ? "default" : "pointer",
      onMouseEnter: () =>
        this.setState(() => {
          this.hovered = true;
        }),
      onMouseLeave: () =>
        this.setState(() => {
          this.hovered = false;
        }),
      onClick: (event) => {
        event.stopPropagation();
        if (!item.disabled) {
          ctx.closeContextMenu();
          item.onSelect();
        }
      },
      child: Container({
        width: 170,
        padding: EdgeInsets.symmetric({ horizontal: 8, vertical: 6 }),
        decoration: new BoxDecoration({
          color: this.hovered && !item.disabled ? colors.controlsBackgroundHover : colors.nodeBackground,
          borderRadius: BorderRadius.circular(4),
          border: item.separator ? Border.all({ color: colors.controlsBorder, width: 1 }) : undefined,
        }),
        child: Text(item.label, {
          style: new TextStyle({
            fontFamily: node.fontFamily,
            fontSize: node.fontSize,
            color: item.disabled ? colors.patternDots : colors.nodeColor,
          }),
        }),
      }),
    });
  }
}
