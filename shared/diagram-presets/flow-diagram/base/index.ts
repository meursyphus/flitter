import { SizedBox, type Widget } from "flitter-ui";
import {
  FlowDiagram as HeadlessFlowDiagram,
  FlowNodeItem,
  FlowScene,
  FlowSceneGroup,
} from "flitter-ui/diagram";
import type {
  FlowDiagramCustom,
  FlowDiagramProps,
} from "flitter-ui/diagram";
import { defaultHandles } from "./handles";
import { defaultEdgePath } from "./edge-path";
import { layout } from "./layout";

export type {
  FlowDiagramCustom,
  FlowDiagramData,
  FlowDiagramContext,
  FlowDiagramProps,
} from "flitter-ui/diagram";
export { FlowDiagramController } from "flitter-ui/diagram";
export { defaultHandles, defaultEdgePath, layout };
export { positionOverlay } from "./layout";

/** Structural (non-visual) defaults provided by base. */
export const baseDefaults: Partial<FlowDiagramCustom<any>> = {
  defaultHandles,
  edgePath: defaultEdgePath,
  // The screen-space toolbar is composed by layout.toolbars, outside the transformed scene.
  nodeBox: ({ node, handles, resizeControls, placements, args }) =>
    new FlowNodeItem({
      body: node,
      attachments: [...handles, ...resizeControls],
      placements,
      x: args.positionAbsolute.x,
      y: args.positionAbsolute.y,
      width: args.node.width,
      height: args.node.height,
      measureId: args.node.id,
    }),
  edgeBox: ({ edge, label, reconnectHandles, edgeHandles }) =>
    new FlowSceneGroup({
      children: [edge, label, ...reconnectHandles, ...edgeHandles],
    }),
  viewport: ({ items, guides, nodesSelectionRect, connectionLine }, ctx) =>
    new FlowScene({
      children: [...items, guides, nodesSelectionRect, connectionLine],
      onMeasure: (entries) => ctx.setNodeDimensions(entries),
    }),
  layout,
  reconnectHandle: ({ size }) => SizedBox({ width: size, height: size }),
};

export function BaseFlowDiagram<TConfig extends object = object>({
  custom,
  ...rest
}: Omit<FlowDiagramProps<TConfig>, "custom"> & {
  custom: Partial<FlowDiagramCustom<TConfig>>;
}): Widget {
  return HeadlessFlowDiagram({
    ...rest,
    custom: { ...baseDefaults, ...custom } as FlowDiagramCustom<TConfig>,
  });
}
