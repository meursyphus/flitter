import { deepMerge, isMacOs, type DeepPartial } from "../../shared/utils";
import type { FlowInteraction, FlowOptions, FlowProps } from "./types";

/** Defaults follow todo/diagram-research.md §A; P2 fields are stored now. */
export function resolveInteraction(input?: FlowProps["interaction"]): FlowInteraction {
  const mod = isMacOs() ? "Meta" : "Control";
  const editor: FlowInteraction = {
    pane: {
      drag: "pan",
      scroll: "zoom",
      scrollSpeed: 0.5,
      pinch: true,
      doubleClick: "zoom",
      autoPan: { speed: 15 },
      panKey: "Space",
      selectKey: "Shift",
    },
    select: { enabled: true, mode: "full", toggleKey: mod, elevate: true, edgeHitWidth: 20 },
    drag: {
      enabled: true,
      threshold: 1,
      snap: { grid: false, guides: false, radius: 5 },
      overlap: "allow",
      dropIntoGroup: true,
    },
    connect: {
      enabled: true,
      mode: "strict",
      radius: 20,
      onClick: true,
      reconnect: true,
      reconnectRadius: 10,
      lineType: "default",
    },
    edit: { text: false, waypoints: false, resize: false },
    history: { enabled: true, limit: 100 },
    clipboard: { enabled: true, offset: { x: 20, y: 20 }, system: false },
    contextMenu: { enabled: true, longPress: 500 },
    keys: {
      delete: ["Backspace", "Delete"],
      undo: `${mod}+z`,
      redo: [`${mod}+Shift+z`, `${mod}+y`],
      copy: `${mod}+c`,
      paste: `${mod}+v`,
      duplicate: `${mod}+d`,
      selectAll: `${mod}+a`,
      fitView: "Shift+1",
      zoomIn: ["+", "="],
      zoomOut: "-",
      nudge: ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"],
      escape: "Escape",
    },
    touch: true,
  };
  const preset = typeof input === "string" ? input : (input?.preset ?? "editor");
  const overrides: DeepPartial<FlowInteraction> =
    preset === "viewer"
      ? {
          select: { enabled: false },
          drag: { enabled: false, dropIntoGroup: false },
          connect: { enabled: false, onClick: false, reconnect: false },
          history: { enabled: false },
          clipboard: { enabled: false },
          contextMenu: { enabled: false },
          keys: {
            delete: null,
            undo: null,
            redo: null,
            copy: null,
            paste: null,
            duplicate: null,
            selectAll: null,
            nudge: null,
          },
        }
      : preset === "whiteboard"
        ? {
            pane: { drag: "select" },
            drag: { snap: { guides: true } },
            edit: { text: true, resize: true },
          }
        : {};
  const { preset: _preset, ...partial } = typeof input === "object" ? input : {};
  return deepMerge(deepMerge(editor, overrides), partial);
}

/** Only existing gestures are normalized here. P2 will read the remaining groups directly. */
export function interactionOptions(i: FlowInteraction): Partial<FlowOptions> {
  return {
    panOnDrag: i.pane.drag === "pan",
    selectionOnDrag: i.pane.drag === "select",
    panOnScroll: i.pane.scroll === "pan",
    zoomOnScroll: i.pane.scroll === "zoom",
    panOnScrollSpeed: i.pane.scrollSpeed,
    zoomOnPinch: i.pane.pinch && i.touch,
    zoomOnDoubleClick: i.pane.doubleClick === "zoom",
    autoPanOnNodeDrag: !!i.pane.autoPan,
    autoPanOnConnect: !!i.pane.autoPan,
    autoPanSpeed: typeof i.pane.autoPan === "object" ? i.pane.autoPan.speed : 15,
    panActivationKeyCode: i.pane.panKey,
    selectionKeyCode: i.pane.selectKey,
    elementsSelectable: i.select.enabled,
    selectionMode: i.select.mode,
    multiSelectionKeyCode: i.select.toggleKey,
    elevateNodesOnSelect: i.select.elevate,
    elevateEdgesOnSelect: i.select.elevate,
    edgeInteractionWidth: i.select.edgeHitWidth,
    nodesDraggable: i.drag.enabled,
    nodeDragThreshold: i.drag.threshold,
    snapToGrid: i.drag.snap.grid !== false,
    snapGrid: i.drag.snap.grid || [15, 15],
    nodesConnectable: i.connect.enabled,
    connectionMode: i.connect.mode,
    connectionRadius: i.connect.radius,
    connectOnClick: i.connect.onClick,
    edgesReconnectable: i.connect.reconnect,
    reconnectRadius: i.connect.reconnectRadius,
    connectionLineType: i.connect.lineType,
    isValidConnection: i.connect.validate ?? (() => true),
    nodesResizable: !!i.edit.resize,
    nodeResizeOptions: typeof i.edit.resize === "object" ? i.edit.resize : {},
    deleteKeyCode: i.keys.delete,
  };
}
