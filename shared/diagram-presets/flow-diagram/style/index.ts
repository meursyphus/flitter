import type { FlowDiagramCustom } from "flitter-ui/diagram";
import type { DeepPartial } from "flitter-ui/diagram";

export type StyleConfig<TConfig extends object> = {
  custom: Partial<FlowDiagramCustom<TConfig>>;
  createConfig: (config?: DeepPartial<TConfig>) => TConfig;
};
import { type DefaultFlowConfig, createDefaultConfig } from "./config";
import { defaultContextMenu } from "./parts/context-menu";
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
import { defaultControls } from "./parts/controls";
import { defaultMinimap } from "./parts/minimap";
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
export { defaultControls } from "./parts/controls";
export { defaultResizeControl } from "./parts/resize";
export { defaultMinimap } from "./parts/minimap";
export { ShapePaint, IconPaint, rectPathD } from "./parts/paint";
export { defaultContextMenu, defaultGuides, defaultEdgeHandle };
export { EditableLabel } from "./parts/editable-label";

const defaultCustom: Partial<FlowDiagramCustom<DefaultFlowConfig>> = {
  contextMenu: defaultContextMenu,
  guides: defaultGuides,
  edgeHandle: defaultEdgeHandle,
  node: defaultNode,
  edge: defaultEdge,
  edgeLabel: defaultEdgeLabel,
  handle: defaultHandle,
  connectionLine: defaultConnectionLine,
  background: defaultBackground,
  selectionBox: defaultSelectionBox,
  nodesSelectionRect: defaultNodesSelectionRect,
  resizeControl: defaultResizeControl,
  controls: defaultControls,
  minimap: defaultMinimap,
};

export const defaultStyleConfig: StyleConfig<DefaultFlowConfig> = {
  custom: defaultCustom,
  createConfig: createDefaultConfig,
};
