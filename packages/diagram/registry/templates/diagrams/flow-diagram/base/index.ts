import { SizedBox, type Widget } from "flitter-core";
import {
  FlowDiagram as HeadlessFlowDiagram,
  FlowNodeItem,
  FlowScene,
  FlowSceneGroup,
} from "../../../../../src/engine";
import type {
  FlowDiagramCustom,
  FlowDiagramProps,
} from "../../../../../src/engine";
import { defaultHandles } from "./handles";
import { defaultEdgePath } from "./edge-path";
import { layout } from "./layout";

export type {
  FlowDiagramCustom,
  FlowDiagramData,
  FlowDiagramContext,
  FlowDiagramProps,
} from "../../../../../src/engine";
export { FlowDiagramController } from "../../../../../src/engine";
export { defaultHandles, defaultEdgePath, layout };
export { positionOverlay } from "./layout";

/** Structural (non-visual) defaults provided by base. */
export const baseDefaults: Partial<FlowDiagramCustom<any>> = {
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
  getHandles = defaultHandles,
  getEdgePath = defaultEdgePath,
  ...rest
}: Omit<FlowDiagramProps<TConfig>, "custom"> & {
  custom: Partial<FlowDiagramCustom<TConfig>>;
}): Widget {
  return HeadlessFlowDiagram({
    ...rest,
    getHandles,
    getEdgePath,
    custom: { ...baseDefaults, ...custom } as FlowDiagramCustom<TConfig>,
  });
}
