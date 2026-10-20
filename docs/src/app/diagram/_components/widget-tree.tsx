import Link from "next/link";
import type { FlowDiagramCustom } from "@flitterjs/diagram";

type Slot = keyof FlowDiagramCustom;

// Keep the guide's vocabulary aligned with every public visual extension point.
const parts: Record<Slot, string> = {
  layout: "Arrange the viewport and screen-space overlays. Add inspectors or status bars here.",
  viewport: "Compose scene items in the supplied order. Keep the scene measurement callback.",
  nodeBox: "Position the node body and attachments. Boundary handles follow the measured body size.",
  node: "Return a card, table, chart or any widget. Reuse label and place each inline handle once.",
  nodeLabel: "The preset supplies editable text. Replacing this widget also replaces its editing implementation.",
  handle: "Draw a connection port. getHandles defines geometry; the engine attaches connection gestures.",
  resizeControl: "Draw resize lines and grips. The engine attaches resize gestures.",
  edgeBox: "Compose the edge, label, endpoint targets and bend handles. Preserve children to retain their interactions.",
  edge: "Draw the path and markers. Change routing and hit-test geometry through getEdgePath.",
  edgeLabel: "Draw an edge label using its supplied anchor and interaction state.",
  reconnectHandle: "Endpoint grab area for reconnection. Invisible by default.",
  edgeHandle: "Draw waypoint and midpoint grips. The engine handles dragging, insertion and removal.",
  connectionLine: "Draw the connection preview using the supplied path and validity state.",
  guides: "Draw overlay-local alignment lines. Configure snapping through interaction.",
  nodesSelectionRect: "Selected nodes' bounds in flow coordinates. Supports group dragging when box selection is enabled.",
  background: "Draw the pane background using viewport information, outside the zoom transform.",
  selectionBox: "Draw the selection marquee in pane pixels.",
  nodeToolbar: "Draw node actions. The toolbar follows its node without scaling during zoom.",
  controls: "Arrange zoom, fit and lock buttons. Supplied buttons already have actions.",
  controlButton: "Draw a button from its kind, hover and disabled state. The engine attaches its action.",
  minimap: "Compose background, nodes, mask and viewport outline. The engine handles panning.",
  minimapBackground: "Draw the minimap background within the supplied dimensions.",
  minimapNode: "Draw a node using its minimap rectangle and selection state.",
  minimapMask: "Shade the area outside the visible viewport.",
  minimapViewport: "Draw the viewport outline in minimap coordinates.",
  contextMenu: "Arrange menu items. The engine positions the menu for right-click and long-press.",
  menuItem: "Draw a command or separator. getContextMenuItems supplies actions; the engine handles selection and dismissal.",
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
          <code className="break-words font-mono text-accent">custom.{branch.slot}</code>
          {branch.placement && (
            <span className="ml-2 text-xs text-faint">({branch.placement})</span>
          )}
        </summary>
        <div className="ml-2 border-l border-line pl-3 sm:ml-3 sm:pl-4">
          <p className="max-w-xl py-2 text-sm leading-6 text-soft">
            {part}{" "}
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
      <ul aria-label="Diagram widget composition" className="min-w-0">
        <TreeBranch branch={tree} />
      </ul>
    </div>
  );
}
