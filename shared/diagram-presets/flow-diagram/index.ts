import { defaultContextMenu } from "./parts/context-menu";
import { defaultGuides } from "./parts/guides";
import { defaultEdgeHandle } from "./parts/edge-handle";
import type { Widget } from "flitter-ui";
import { Flow } from "flitter-ui/diagram";
import type { FlowCustom, FlowPanel, FlowProps } from "flitter-ui/diagram";
import type { DeepPartial } from "flitter-ui/diagram";
import { type DefaultFlowConfig, createDefaultConfig } from "./config";
import { defaultBackground } from "./parts/background";
import {
  defaultConnectionLine,
  defaultEdge,
  defaultEdgeLabel,
  defaultEdgePath,
  defaultEdgeTypes,
} from "./parts/edge";
import { defaultHandle } from "./parts/handle";
import { defaultHandles, defaultNode, defaultNodeTypes } from "./parts/node";
import { defaultNodesSelectionRect, defaultSelectionBox } from "./parts/selection";
import { DefaultControls } from "./parts/controls";
import { DefaultMiniMap } from "./parts/minimap";
import { defaultReconnectHandle, defaultResizeControl } from "./parts/resize";

export {
  type DefaultFlowConfig,
  type DefaultColors,
  createDefaultConfig,
  defaultConfig,
  lightColors as defaultLightColors,
  darkColors as defaultDarkColors,
} from "./config";
export { defaultNode, defaultNodeTypes, defaultHandles, nodeLabel } from "./parts/node";
export { defaultEdge, defaultEdgeTypes, defaultEdgeLabel, defaultConnectionLine, defaultEdgePath } from "./parts/edge";
export { defaultHandle } from "./parts/handle";
export { defaultBackground } from "./parts/background";
export { defaultSelectionBox, defaultNodesSelectionRect } from "./parts/selection";
export { DefaultControls } from "./parts/controls";
export { defaultResizeControl, defaultReconnectHandle } from "./parts/resize";
export { DefaultMiniMap } from "./parts/minimap";
export { ShapePaint, IconPaint, rectPathD } from "./parts/paint";

export { defaultContextMenu, defaultGuides, defaultEdgeHandle };

export const defaultCustom: FlowCustom<DefaultFlowConfig> = {
  contextMenu: defaultContextMenu,
  guides: defaultGuides,
  edgeHandle: defaultEdgeHandle,
  node: defaultNode,
  edge: defaultEdge,
  edgeLabel: defaultEdgeLabel,
  handle: defaultHandle,
  defaultHandles: (node, ctx) => defaultHandles(node).map(handle => ({ ...handle, width: ctx.config.handle.size, height: ctx.config.handle.size })),
  connectionLine: defaultConnectionLine,
  background: defaultBackground,
  selectionBox: defaultSelectionBox,
  nodesSelectionRect: defaultNodesSelectionRect,
  edgePath: defaultEdgePath,
  resizeControl: defaultResizeControl,
  reconnectHandle: defaultReconnectHandle,
};

export type FlowDiagramProps = Omit<FlowProps<DefaultFlowConfig>, "custom" | "config"> & {
  config?: DeepPartial<DefaultFlowConfig>;
  custom?: Partial<FlowCustom<DefaultFlowConfig>>;
};

/**
 * Styled diagram with React Flow's default look. Pass `config` to tune
 * colours, controls and minimap; `custom`, `nodeTypes` and `edgeTypes` to
 * replace any part.
 */
export function FlowDiagram(props: FlowDiagramProps): Widget {
  const config = createDefaultConfig(props.config);
  const panels: FlowPanel[] = [];
  if (config.controls.visible) panels.push({ position: config.controls.position, child: DefaultControls() });
  if (config.minimap.visible) panels.push({ position: config.minimap.position, child: DefaultMiniMap() });
  if (props.panels) panels.push(...props.panels);
  return Flow<DefaultFlowConfig>({
    ...props,
    config,
    custom: { ...defaultCustom, ...props.custom },
    nodeTypes: {
      ...Object.fromEntries(Object.entries(defaultNodeTypes).map(([name, definition]) => [name, {
        ...definition,
        handles: Array.isArray(definition.handles)
          ? definition.handles.map(handle => ({ ...handle, width: config.handle.size, height: config.handle.size }))
          : definition.handles,
      }])),
      ...props.nodeTypes,
    },
    edgeTypes: { ...defaultEdgeTypes, ...props.edgeTypes },
    panels,
  });
}

export default FlowDiagram;

export { EditableLabel } from "./parts/editable-label";
