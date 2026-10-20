import Link from "next/link";
import type { FlowDiagramCustom } from "@flitterjs/diagram";

type Slot = keyof FlowDiagramCustom;

// Keep the guide's vocabulary aligned with every public visual extension point.
const parts: Record<Slot, { label: string; description: string }> = {
  layout: {
    label: "Workspace",
    description: "Arrange the viewport, background and screen-space overlays. Add application UI here, such as an inspector or status bar.",
  },
  viewport: {
    label: "Pan and zoom",
    description: "Compose scene items and flow-space overlays. Preserve the supplied items order and the default scene's measurement callback.",
  },
  nodeBox: {
    label: "Node placement",
    description: "Position the node body and its attachments. The default measures the body and places boundary handles against its size.",
  },
  node: {
    label: "Node body",
    description: "Draw a card, table, chart or any widget. Reuse label and place each supplied inline handle once.",
  },
  nodeLabel: {
    label: "Node text",
    description: "Replace the label inside a node. The preset supplies editable text; replacing it also replaces that label implementation.",
  },
  handle: {
    label: "Connection port",
    description: "Draw a port using connection state. The engine supplies connection gestures; getHandles declares its geometry and placement.",
  },
  resizeControl: {
    label: "Resize grips",
    description: "Draw a selected node's resize lines and handles. The engine attaches the resize gestures.",
  },
  edgeBox: {
    label: "Edge composition",
    description: "Compose the edge, label, endpoint targets and bend handles. Keep the supplied children to retain their interactions.",
  },
  edge: {
    label: "Connection stroke",
    description: "Draw the supplied path and markers. Use getEdgePath to change routing geometry, including the engine's hit-test path.",
  },
  edgeLabel: {
    label: "Connection label",
    description: "Replace an edge's label with text or a richer widget. The engine supplies its anchor and interaction state.",
  },
  reconnectHandle: {
    label: "Endpoint targets",
    description: "Draw the grab area at each edge endpoint. The default is invisible but still receives reconnection gestures.",
  },
  edgeHandle: {
    label: "Bend handles",
    description: "Draw waypoint and midpoint grips. The engine handles dragging, insertion and removal.",
  },
  connectionLine: {
    label: "Connection preview",
    description: "Draw the temporary line while connecting ports. Use validity state to distinguish accepted and rejected targets.",
  },
  guides: {
    label: "Alignment guides",
    description: "Draw alignment feedback from the supplied overlay-local lines. Snapping behavior is configured through interaction.",
  },
  nodesSelectionRect: {
    label: "Selected group bounds",
    description: "Draw bounds around multiple selected nodes in flow coordinates. The engine attaches group dragging when box selection is enabled.",
  },
  background: {
    label: "Pane background",
    description: "Draw dots, lines or another pattern. It sits outside the transformed scene and receives viewport information.",
  },
  selectionBox: {
    label: "Selection marquee",
    description: "Draw the rectangle while selecting an area. Its bounds are measured in pane pixels.",
  },
  nodeToolbar: {
    label: "Node actions",
    description: "Draw a node's toolbar. The engine positions it beside the node in screen space, keeping its size constant during zoom.",
  },
  controls: {
    label: "Control layout",
    description: "Arrange zoom, fit and lock buttons. Each supplied child already has its action attached.",
  },
  controlButton: {
    label: "Control appearance",
    description: "Draw one button from its kind, hover and disabled state. Standard click behavior is attached by the engine.",
  },
  minimap: {
    label: "Minimap composition",
    description: "Arrange the minimap's background, nodes, mask and viewport outline. The engine handles minimap panning.",
  },
  minimapBackground: {
    label: "Minimap surface",
    description: "Draw the minimap background within the supplied width and height.",
  },
  minimapNode: {
    label: "Minimap node",
    description: "Draw one node using its minimap rectangle and selection state.",
  },
  minimapMask: {
    label: "Outside the viewport",
    description: "Shade the minimap area outside the visible viewport.",
  },
  minimapViewport: {
    label: "Visible area",
    description: "Draw the current viewport outline in minimap coordinates.",
  },
  contextMenu: {
    label: "Menu layout",
    description: "Arrange the supplied menu item widgets. The engine positions the menu for right-click and long-press.",
  },
  menuItem: {
    label: "Menu appearance",
    description: "Draw one command or separator. getContextMenuItems supplies commands; the engine attaches selection and dismissal behavior.",
  },
};

type Branch = { slot: Slot; placement?: string; children?: Branch[] };
const tree: Branch = {
  slot: "layout",
  children: [
    { slot: "background" },
    {
      slot: "viewport",
      children: [
        {
          slot: "nodeBox",
          children: [
            {
              slot: "node",
              children: [
                { slot: "nodeLabel" },
                { slot: "handle", placement: "inline" },
              ],
            },
            { slot: "handle", placement: "boundary" },
            { slot: "resizeControl" },
          ],
        },
        {
          slot: "edgeBox",
          children: [
            { slot: "edge" },
            { slot: "edgeLabel" },
            { slot: "reconnectHandle" },
            { slot: "edgeHandle" },
          ],
        },
        { slot: "guides" },
        { slot: "nodesSelectionRect" },
        { slot: "connectionLine" },
      ],
    },
    { slot: "selectionBox" },
    { slot: "nodeToolbar", placement: "via toolbars" },
    { slot: "controls", children: [{ slot: "controlButton" }] },
    {
      slot: "minimap",
      children: [
        { slot: "minimapBackground" },
        { slot: "minimapNode" },
        { slot: "minimapMask" },
        { slot: "minimapViewport" },
      ],
    },
    { slot: "contextMenu", children: [{ slot: "menuItem" }] },
  ],
};

function TreeBranch({ branch }: { branch: Branch }) {
  const part = parts[branch.slot];
  return (
    <li className="min-w-0">
      <details open={branch.slot === "layout" || branch.slot === "viewport" || branch.slot === "nodeBox"}>
        <summary className="cursor-pointer rounded-md py-2 text-sm text-ink hover:bg-surface">
          <code className="break-words font-mono text-accent">{branch.slot}</code>
          {branch.placement && (
            <span className="ml-2 text-xs text-faint">({branch.placement})</span>
          )}
          <span className="mt-0.5 block pl-4 text-xs text-soft sm:ml-3 sm:inline sm:pl-0">
            {part.label}
          </span>
        </summary>
        <div className="ml-2 border-l border-line pl-3 sm:ml-3 sm:pl-4">
          <p className="max-w-xl py-2 text-sm leading-6 text-soft">
            {part.description}{" "}
            <Link
              href={`/diagram/api#custom-${branch.slot}`}
              aria-label={`${branch.slot} API reference`}
              className="whitespace-nowrap text-accent underline underline-offset-4"
            >
              API ↗
            </Link>
          </p>
          {branch.children && (
            <ul className="pb-2">
              {branch.children.map((child) => (
                <TreeBranch key={`${child.slot}-${child.placement ?? ""}`} branch={child} />
              ))}
            </ul>
          )}
        </div>
      </details>
    </li>
  );
}

export default function WidgetTree() {
  return (
    <div className="rounded-xl border border-line bg-canvas p-4 sm:p-6">
      <p className="mb-4 border-b border-line pb-4 text-sm text-soft">
        Expand a part to see its role and children. Every name maps to <code>custom.name</code>.
      </p>
      <ul aria-label="Diagram widget composition" className="min-w-0">
        <TreeBranch branch={tree} />
      </ul>
    </div>
  );
}
