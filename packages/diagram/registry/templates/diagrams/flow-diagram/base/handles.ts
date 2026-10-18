import type {
  FlowNode,
  FlowDiagramContext,
  HandleSpec,
} from "../../../../../src/engine";

export function defaultHandles(
  node: FlowNode,
  context: FlowDiagramContext<any>,
): HandleSpec[] {
  const size = context.config?.handle?.size;
  const target: HandleSpec = {
    type: "target",
    position: "top",
    width: size,
    height: size,
  };
  const source: HandleSpec = {
    type: "source",
    position: "bottom",
    width: size,
    height: size,
  };
  return node.type === "group"
    ? []
    : node.type === "input"
      ? [source]
      : node.type === "output"
        ? [target]
        : [target, source];
}
