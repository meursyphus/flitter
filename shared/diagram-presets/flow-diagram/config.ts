import { type DeepPartial, deepMerge } from "flitter-ui/diagram";
import type { PanelPosition } from "flitter-ui/diagram";

/** Colour tokens. Values mirror React Flow's `style.css` custom properties. */
export type XyflowColors = {
  background: string;
  patternDots: string;
  patternLines: string;
  patternCross: string;
  nodeBackground: string;
  nodeGroupBackground: string;
  nodeBorder: string;
  nodeSelectedBorder: string;
  nodeColor: string;
  nodeHoverShadow: string;
  handleBackground: string;
  handleBorder: string;
  handleValid: string;
  handleInvalid: string;
  edgeStroke: string;
  edgeStrokeSelected: string;
  edgeStrokeUpdating: string;
  edgeLabelBackground: string;
  edgeLabelColor: string;
  connectionLine: string;
  selectionBackground: string;
  selectionBorder: string;
  controlsBackground: string;
  controlsBackgroundHover: string;
  controlsColor: string;
  controlsBorder: string;
  controlsShadow: string;
  minimapBackground: string;
  minimapMask: string;
  minimapNode: string;
  minimapViewportStroke: string;
};

export const lightColors: XyflowColors = {
  background: "#ffffff",
  patternDots: "#91919a",
  patternLines: "#eeeeee",
  patternCross: "#e2e2e2",
  nodeBackground: "#ffffff",
  nodeGroupBackground: "rgba(240, 240, 240, 0.25)",
  nodeBorder: "#1a192b",
  nodeSelectedBorder: "#1a192b",
  nodeColor: "#222222",
  nodeHoverShadow: "rgba(0, 0, 0, 0.08)",
  handleBackground: "#1a192b",
  handleBorder: "#ffffff",
  handleValid: "#55dd99",
  handleInvalid: "#ff0072",
  edgeStroke: "#b1b1b7",
  edgeStrokeSelected: "#555555",
  edgeStrokeUpdating: "#777777",
  edgeLabelBackground: "#ffffff",
  edgeLabelColor: "#222222",
  connectionLine: "#b1b1b7",
  selectionBackground: "rgba(0, 89, 220, 0.08)",
  selectionBorder: "rgba(0, 89, 220, 0.8)",
  controlsBackground: "#fefefe",
  controlsBackgroundHover: "#f4f4f4",
  controlsColor: "#222222",
  controlsBorder: "#eeeeee",
  controlsShadow: "rgba(0, 0, 0, 0.08)",
  minimapBackground: "#ffffff",
  minimapMask: "rgba(240, 240, 240, 0.6)",
  minimapNode: "#e2e2e2",
  minimapViewportStroke: "transparent",
};

export const darkColors: XyflowColors = {
  background: "#141414",
  patternDots: "#777777",
  patternLines: "#777777",
  patternCross: "#777777",
  nodeBackground: "#1e1e1e",
  nodeGroupBackground: "rgba(240, 240, 240, 0.25)",
  nodeBorder: "#3c3c3c",
  nodeSelectedBorder: "#999999",
  nodeColor: "#f8f8f8",
  nodeHoverShadow: "rgba(255, 255, 255, 0.08)",
  handleBackground: "#bebebe",
  handleBorder: "#1e1e1e",
  handleValid: "#55dd99",
  handleInvalid: "#ff0072",
  edgeStroke: "#3e3e3e",
  edgeStrokeSelected: "#727272",
  edgeStrokeUpdating: "#777777",
  edgeLabelBackground: "#141414",
  edgeLabelColor: "#f8f8f8",
  connectionLine: "#b1b1b7",
  selectionBackground: "rgba(200, 200, 220, 0.08)",
  selectionBorder: "rgba(200, 200, 220, 0.8)",
  controlsBackground: "#2b2b2b",
  controlsBackgroundHover: "#3e3e3e",
  controlsColor: "#f8f8f8",
  controlsBorder: "#5b5b5b",
  controlsShadow: "rgba(0, 0, 0, 0.08)",
  minimapBackground: "#141414",
  minimapMask: "rgba(60, 60, 60, 0.6)",
  minimapNode: "#2b2b2b",
  minimapViewportStroke: "transparent",
};

export type XyflowFlowConfig = {
  colorMode: "light" | "dark";
  colors: XyflowColors;
  node: {
    width: number;
    padding: number;
    borderRadius: number;
    borderWidth: number;
    fontSize: number;
    fontFamily: string;
  };
  handle: {
    size: number;
    borderWidth: number;
    /** Transparent padding around the dot that still counts as the handle. */
    hitPadding: number;
  };
  edge: {
    strokeWidth: number;
    curvature: number;
    stepOffset: number;
    stepBorderRadius: number;
    markerColor: string | null;
    markerSize: number;
    animatedDash: number;
    animationDuration: number;
  };
  edgeLabel: {
    fontSize: number;
    paddingX: number;
    paddingY: number;
    borderRadius: number;
    showBackground: boolean;
  };
  connectionLine: {
    strokeWidth: number;
  };
  background: {
    visible: boolean;
    variant: "dots" | "lines" | "cross";
    gap: number;
    /** Dot radius × 2, line width, or cross size. Defaults per variant. */
    size: number | null;
    lineWidth: number;
    color: string | null;
  };
  selection: {
    dash: number;
    borderWidth: number;
  };
  resize: {
    color: string;
    handleSize: number;
    lineWidth: number;
    /** Transparent padding that still grabs the control. */
    hitPadding: number;
  };
  controls: {
    visible: boolean;
    position: PanelPosition;
    showZoom: boolean;
    showFitView: boolean;
    showInteractive: boolean;
    buttonSize: number;
    iconSize: number;
    fitViewDuration: number;
    zoomDuration: number;
  };
  minimap: {
    visible: boolean;
    position: PanelPosition;
    width: number;
    height: number;
    pannable: boolean;
    nodeBorderRadius: number;
    offsetScale: number;
    nodeColor: string | null;
    maskColor: string | null;
  };
};

export const defaultXyflowConfig: XyflowFlowConfig = {
  colorMode: "light",
  colors: lightColors,
  node: {
    width: 150,
    padding: 10,
    borderRadius: 3,
    borderWidth: 1,
    fontSize: 12,
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  handle: { size: 6, borderWidth: 1, hitPadding: 4 },
  edge: {
    strokeWidth: 1,
    curvature: 0.25,
    stepOffset: 20,
    stepBorderRadius: 5,
    markerColor: null,
    markerSize: 12.5,
    animatedDash: 5,
    animationDuration: 500,
  },
  edgeLabel: { fontSize: 10, paddingX: 4, paddingY: 2, borderRadius: 2, showBackground: true },
  connectionLine: { strokeWidth: 1 },
  background: { visible: true, variant: "dots", gap: 20, size: null, lineWidth: 1, color: null },
  selection: { dash: 1, borderWidth: 1 },
  resize: { color: "#3367d9", handleSize: 4, lineWidth: 1, hitPadding: 4 },
  controls: {
    visible: true,
    position: "bottom-left",
    showZoom: true,
    showFitView: true,
    showInteractive: true,
    buttonSize: 26,
    iconSize: 12,
    fitViewDuration: 200,
    zoomDuration: 0,
  },
  minimap: {
    visible: true,
    position: "bottom-right",
    width: 200,
    height: 150,
    pannable: true,
    nodeBorderRadius: 5,
    offsetScale: 5,
    nodeColor: null,
    maskColor: null,
  },
};

export function createXyflowConfig(config?: DeepPartial<XyflowFlowConfig>): XyflowFlowConfig {
  const colorMode = config?.colorMode ?? defaultXyflowConfig.colorMode;
  const base: XyflowFlowConfig = {
    ...defaultXyflowConfig,
    colorMode,
    colors: colorMode === "dark" ? darkColors : lightColors,
  };
  return deepMerge(base, config);
}
