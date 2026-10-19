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
} from "flitterjs";
import type {
  ContextMenuCustomArgs,
  MenuItemCustomArgs,
  FlowDiagramContext,
} from "../../../../../../../src/engine";
import type { DefaultFlowConfig } from "../config";

export function defaultContextMenu(
  args: ContextMenuCustomArgs & { items: Widget[] },
  ctx: FlowDiagramContext<DefaultFlowConfig>,
): Widget {
  const { colors, contextMenu } = ctx.config;
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
      children: args.items,
    }),
  });
}

export function defaultMenuItem(
  item: MenuItemCustomArgs,
  ctx: FlowDiagramContext<DefaultFlowConfig>,
): Widget {
  const { colors, node, contextMenu } = ctx.config;
  return Container({
    width: 170,
    padding: EdgeInsets.symmetric({ horizontal: 8, vertical: 6 }),
    decoration: new BoxDecoration({
      color:
        item.isHovered && !item.isDisabled
          ? colors.controlsBackgroundHover
          : colors.nodeBackground,
      borderRadius: BorderRadius.circular(contextMenu.itemBorderRadius),
      border: item.isSeparator
        ? Border.all({ color: colors.controlsBorder, width: 1 })
        : undefined,
    }),
    child: Text(item.label, {
      style: new TextStyle({
        fontFamily: contextMenu.fontFamily ?? node.fontFamily,
        fontSize: contextMenu.fontSize ?? node.fontSize,
        color: item.isDisabled ? colors.patternDots : colors.nodeColor,
      }),
    }),
  });
}
