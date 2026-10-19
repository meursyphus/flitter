import type { Widget } from "flitter-core";
import type { FlowDiagramProps } from "./types";
import { FlowDiagramProvider } from "./provider";

export default function FlowDiagram<TConfig extends object = object>(
  props: FlowDiagramProps<TConfig>,
): Widget {
  return FlowDiagramProvider(props);
}
export { reactFlowWheelScale } from "./diagram";
export { FlowDiagramController, DEFAULT_FLOW_OPTIONS } from "./controller";
export { FlowDiagramProvider } from "./provider";
export {
  FlowScene,
  FlowSceneGroup,
  FlowSceneItem,
  FlowNodeItem,
  RenderFlowScene,
  RenderFlowSceneGroup,
  RenderFlowSceneItem,
  RenderFlowNodeItem,
} from "./scene";
export type { NodeAttachmentPlacement, MeasureEntry } from "./scene";
export * from "./types";

export { getDefaultContextMenuItems } from "./menu";
