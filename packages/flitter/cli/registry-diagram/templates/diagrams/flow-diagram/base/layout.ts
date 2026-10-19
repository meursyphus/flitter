import {
  Center,
  Positioned,
  SizedBox,
  Stack,
  StackFit,
  type Widget,
} from "flitterjs";
import type {
  FlowDiagramCustom,
  PanelPosition,
} from "../../../../../src/engine";

/** A layout override can reuse this helper to add screen-space overlays. */
export function positionOverlay(
  position: PanelPosition,
  child: Widget,
): Widget {
  const [vertical, horizontal] = position.split("-");
  const top = vertical === "top" ? 15 : undefined,
    bottom = vertical === "bottom" ? 15 : undefined;
  if (horizontal === "center")
    return Positioned({
      top,
      bottom,
      left: 0,
      right: 0,
      child: Center({ child }),
    });
  return Positioned({
    top,
    bottom,
    left: horizontal === "left" ? 15 : undefined,
    right: horizontal === "right" ? 15 : undefined,
    child,
  });
}

export const layout: FlowDiagramCustom<any>["layout"] = (args, context) => {
  const { controls, minimap } = context.config ?? {};
  return Stack({
    fit: StackFit.expand,
    children: [
      args.background,
      args.viewport,
      args.selectionBox,
      args.toolbars,
      controls?.visible
        ? positionOverlay(controls.position, args.controls)
        : SizedBox.shrink(),
      minimap?.visible
        ? positionOverlay(minimap.position, args.minimap)
        : SizedBox.shrink(),
      args.contextMenu,
    ],
  });
};
