import { SizedBox } from "flitter-ui";
import { EditableLabel } from "./parts/editable-label";
import type { FlowDiagramCustom } from "flitter-ui/diagram";
import type { DeepPartial } from "flitter-ui/diagram";

export type StyleConfig<TConfig extends object> = {
  custom: Partial<FlowDiagramCustom<TConfig>>;
  createConfig: (config?: DeepPartial<TConfig>) => TConfig;
};
import { type DefaultFlowConfig, createDefaultConfig } from "./config";
import { defaultContextMenu, defaultMenuItem } from "./parts/context-menu";
import { defaultGuides } from "./parts/guides";
import { defaultEdgeHandle } from "./parts/edge-handle";
import { defaultBackground } from "./parts/background";
import {
  defaultConnectionLine,
  defaultEdge,
  defaultEdgeLabel,
} from "./parts/edge";
import { defaultHandle } from "./parts/handle";
import { defaultNode } from "./parts/node";
import {
  defaultNodesSelectionRect,
  defaultSelectionBox,
} from "./parts/selection";
import { defaultControls, defaultControlButton } from "./parts/controls";
import {
  defaultMinimap,
  defaultMinimapNode,
  defaultMinimapBackground,
  defaultMinimapMask,
  defaultMinimapViewport,
} from "./parts/minimap";
import { defaultResizeControl } from "./parts/resize";

export {
  type DefaultFlowConfig,
  type DefaultColors,
  defaultConfig,
  lightColors as defaultLightColors,
  darkColors as defaultDarkColors,
} from "./config";
export { defaultNode, nodeLabel } from "./parts/node";
export {
  defaultEdge,
  defaultEdgeLabel,
  defaultConnectionLine,
} from "./parts/edge";
export { defaultHandle } from "./parts/handle";
export { defaultBackground } from "./parts/background";
export {
  defaultSelectionBox,
  defaultNodesSelectionRect,
} from "./parts/selection";
export { defaultControls, defaultControlButton } from "./parts/controls";
export { defaultResizeControl } from "./parts/resize";
export {
  defaultMinimap,
  defaultMinimapNode,
  defaultMinimapBackground,
  defaultMinimapMask,
  defaultMinimapViewport,
} from "./parts/minimap";
export { ShapePaint, IconPaint, rectPathD } from "./parts/paint";
export {
  defaultContextMenu,
  defaultMenuItem,
  defaultGuides,
  defaultEdgeHandle,
};
export { EditableLabel } from "./parts/editable-label";

const defaultCustom: Partial<FlowDiagramCustom<DefaultFlowConfig>> = {
  contextMenu: defaultContextMenu,
  menuItem: defaultMenuItem,
  guides: defaultGuides,
  edgeHandle: defaultEdgeHandle,
  node: defaultNode,
  nodeLabel: EditableLabel,
  nodeToolbar: () => SizedBox.shrink(),
  edge: defaultEdge,
  edgeLabel: defaultEdgeLabel,
  handle: defaultHandle,
  connectionLine: defaultConnectionLine,
  background: defaultBackground,
  selectionBox: defaultSelectionBox,
  nodesSelectionRect: defaultNodesSelectionRect,
  resizeControl: defaultResizeControl,
  controls: defaultControls,
  controlButton: defaultControlButton,
  minimap: defaultMinimap,
  minimapNode: defaultMinimapNode,
  minimapBackground: defaultMinimapBackground,
  minimapMask: defaultMinimapMask,
  minimapViewport: defaultMinimapViewport,
};

export const defaultStyleConfig: StyleConfig<DefaultFlowConfig> = {
  custom: defaultCustom,
  createConfig: createDefaultConfig,
};
