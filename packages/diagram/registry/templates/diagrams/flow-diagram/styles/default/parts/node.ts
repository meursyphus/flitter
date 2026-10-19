import {
  Alignment,
  Border,
  BorderRadius,
  BoxDecoration,
  BoxShadow,
  Container,
  EdgeInsets,
  type Widget,
} from "flitter-core";
import type {
  FlowDiagramContext,
  FlowNode,
  NodeCustomArgs,
} from "../../../../../../../src/engine";
import { EditableLabel } from "./editable-label";
import type { DefaultFlowConfig } from "../config";

export function nodeLabel(node: FlowNode): string {
  const data = node.data as { label?: unknown } | undefined;
  return typeof data?.label === "string" || typeof data?.label === "number"
    ? String(data.label)
    : node.id;
}

/** React Flow's default node: 150px wide white box with a 1px border and centred label. */
export function defaultNode(
  args: NodeCustomArgs,
  context: FlowDiagramContext<DefaultFlowConfig>,
): Widget {
  const { node, isSelected, isHovered } = args;
  const { colors, node: n } = context.config;
  const isGroup = node.type === "group";
  const borderWidth = isSelected ? n.borderWidth + 0.5 : n.borderWidth;
  return Container({
    width: node.width ?? (isGroup ? undefined : n.width),
    height: node.height,
    padding: EdgeInsets.all(n.padding),
    alignment: Alignment.center,
    decoration: new BoxDecoration({
      color: isGroup ? colors.nodeGroupBackground : colors.nodeBackground,
      border: Border.all({
        color: args.isDropTarget
          ? colors.selectionBorder
          : isSelected
            ? colors.nodeSelectedBorder
            : colors.nodeBorder,
        width: borderWidth,
      }),
      borderRadius: BorderRadius.circular(n.borderRadius),
      boxShadow:
        isHovered && !isSelected
          ? [
              new BoxShadow({
                color: colors.nodeHoverShadow,
                offset: { x: 0, y: 1 },
                blurRadius: 4,
              }),
            ]
          : undefined,
    }),
    child: isGroup ? undefined : EditableLabel(args, context),
  });
}
