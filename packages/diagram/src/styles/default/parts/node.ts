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
import type { FlowContext, FlowNode, HandleSpec, NodeBuilderArgs, NodeTypeDefinition } from "../../../headless/flow/types";
import { EditableLabel } from "./editable-label";
import type { DefaultFlowConfig } from "../config";

export function nodeLabel(node: FlowNode): string {
  const data = node.data as { label?: unknown } | undefined;
  return typeof data?.label === "string" || typeof data?.label === "number" ? String(data.label) : node.id;
}

/** React Flow's default node: 150px wide white box with a 1px border and centred label. */
export function defaultNode(args: NodeBuilderArgs, context: FlowContext<DefaultFlowConfig>): Widget {
  const { node, selected, hovered } = args;
  const { colors, node: n } = context.config;
  const isGroup = node.type === "group";
  const borderWidth = selected ? n.borderWidth + 0.5 : n.borderWidth;
  return Container({
    width: node.width ?? (isGroup ? undefined : n.width),
    height: node.height,
    padding: EdgeInsets.all(n.padding),
    alignment: Alignment.center,
    decoration: new BoxDecoration({
      color: isGroup ? colors.nodeGroupBackground : colors.nodeBackground,
      border: Border.all({ color: args.isDropTarget ? colors.selectionBorder : selected ? colors.nodeSelectedBorder : colors.nodeBorder, width: borderWidth }),
      borderRadius: BorderRadius.circular(n.borderRadius),
      boxShadow:
        hovered && !selected
          ? [new BoxShadow({ color: colors.nodeHoverShadow, offset: { x: 0, y: 1 }, blurRadius: 4 })]
          : undefined,
    }),
    child: isGroup
      ? undefined
      : EditableLabel(args, context),
  });
}

const targetTop: HandleSpec = { type: "target", position: "top" };
const sourceBottom: HandleSpec = { type: "source", position: "bottom" };

export function defaultHandles(_node: FlowNode): HandleSpec[] {
  return [targetTop, sourceBottom];
}

/** `default`, `input`, `output` and `group` node types, as in React Flow. */
export const defaultNodeTypes: Record<string, NodeTypeDefinition<DefaultFlowConfig>> = {
  default: { build: defaultNode, handles: [targetTop, sourceBottom] },
  input: { build: defaultNode, handles: [sourceBottom] },
  output: { build: defaultNode, handles: [targetTop] },
  group: { build: defaultNode, handles: [] },
};
