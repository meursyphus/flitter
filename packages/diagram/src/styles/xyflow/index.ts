import type { Widget } from "flitter-core";
import { Flow } from "../../headless/flow/flow";
import type { FlowCustom, FlowPanel, FlowProps } from "../../headless/flow/types";
import type { DeepPartial } from "../../shared/utils";
import { type XyflowFlowConfig, createXyflowConfig } from "./config";
import { xyflowBackground } from "./parts/background";
import {
  xyflowConnectionLine,
  xyflowEdge,
  xyflowEdgeLabel,
  xyflowEdgePath,
  xyflowEdgeTypes,
} from "./parts/edge";
import { xyflowHandle } from "./parts/handle";
import { xyflowDefaultHandles, xyflowNode, xyflowNodeTypes } from "./parts/node";
import { xyflowNodesSelectionRect, xyflowSelectionBox } from "./parts/selection";
import { XyflowControls } from "./parts/controls";
import { XyflowMiniMap } from "./parts/minimap";
import { xyflowReconnectHandle, xyflowResizeControl } from "./parts/resize";

export {
  type XyflowFlowConfig,
  type XyflowColors,
  createXyflowConfig,
  defaultXyflowConfig,
  lightColors as xyflowLightColors,
  darkColors as xyflowDarkColors,
} from "./config";
export { xyflowNode, xyflowNodeTypes, xyflowDefaultHandles, nodeLabel } from "./parts/node";
export { xyflowEdge, xyflowEdgeTypes, xyflowEdgeLabel, xyflowConnectionLine, xyflowEdgePath } from "./parts/edge";
export { xyflowHandle } from "./parts/handle";
export { xyflowBackground } from "./parts/background";
export { xyflowSelectionBox, xyflowNodesSelectionRect } from "./parts/selection";
export { XyflowControls } from "./parts/controls";
export { xyflowResizeControl, xyflowReconnectHandle } from "./parts/resize";
export { XyflowMiniMap } from "./parts/minimap";
export { ShapePaint, IconPaint, rectPathD } from "./parts/paint";

export const xyflowCustom: FlowCustom<XyflowFlowConfig> = {
  node: xyflowNode,
  edge: xyflowEdge,
  edgeLabel: xyflowEdgeLabel,
  handle: xyflowHandle,
  defaultHandles: xyflowDefaultHandles,
  connectionLine: xyflowConnectionLine,
  background: xyflowBackground,
  selectionBox: xyflowSelectionBox,
  nodesSelectionRect: xyflowNodesSelectionRect,
  edgePath: xyflowEdgePath,
  resizeControl: xyflowResizeControl,
  reconnectHandle: xyflowReconnectHandle,
};

export type FlowDiagramProps = Omit<FlowProps<XyflowFlowConfig>, "custom" | "config"> & {
  config?: DeepPartial<XyflowFlowConfig>;
  custom?: Partial<FlowCustom<XyflowFlowConfig>>;
};

/**
 * Styled diagram with React Flow's default look. Pass `config` to tune
 * colours, controls and minimap; `custom`, `nodeTypes` and `edgeTypes` to
 * replace any part.
 */
export function FlowDiagram(props: FlowDiagramProps): Widget {
  const config = createXyflowConfig(props.config);
  const panels: FlowPanel[] = [];
  if (config.controls.visible) panels.push({ position: config.controls.position, child: XyflowControls() });
  if (config.minimap.visible) panels.push({ position: config.minimap.position, child: XyflowMiniMap() });
  if (props.panels) panels.push(...props.panels);
  return Flow<XyflowFlowConfig>({
    ...props,
    config,
    custom: { ...xyflowCustom, ...props.custom },
    nodeTypes: { ...xyflowNodeTypes, ...props.nodeTypes },
    edgeTypes: { ...xyflowEdgeTypes, ...props.edgeTypes },
    handleSize: props.handleSize ?? config.handle.size,
    panels,
  });
}

export default FlowDiagram;
