import {
  getEdgePathByType,
  type EdgePathCustomArgs,
  type FlowDiagramContext,
} from "../../../../../src/engine";

/** Built-in path geometry with the style's curvature/offset defaults. */
export function defaultEdgePath(
  args: EdgePathCustomArgs,
  context: FlowDiagramContext<any>,
) {
  const { edge: e } = context.config ?? {};
  const options = {
    curvature: args.edge?.pathOptions?.curvature ?? e?.curvature,
    offset: args.edge?.pathOptions?.offset ?? e?.stepOffset,
    borderRadius: args.edge?.pathOptions?.borderRadius ?? e?.stepBorderRadius,
  };
  return getEdgePathByType(args.type, args.params, options);
}
