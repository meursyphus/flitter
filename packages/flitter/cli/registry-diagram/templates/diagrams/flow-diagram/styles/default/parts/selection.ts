import { type Widget } from "flitterjs";
import type {
  FlowDiagramContext,
  NodesSelectionRectCustomArgs,
  SelectionBoxCustomArgs,
} from "../../../../../../../src/engine";
import type { DefaultFlowConfig } from "../config";
import { ShapePaint, rectPathD } from "./paint";

function selectionRect(
  width: number,
  height: number,
  context: FlowDiagramContext<DefaultFlowConfig>,
): Widget {
  const { colors, selection } = context.config;
  const inset = selection.borderWidth / 2;
  return ShapePaint({
    width,
    height,
    shapes: {
      fill: {
        d: rectPathD(0, 0, width, height),
        fill: colors.selectionBackground,
      },
      border: {
        d: rectPathD(
          inset,
          inset,
          Math.max(0, width - inset * 2),
          Math.max(0, height - inset * 2),
        ),
        stroke: colors.selectionBorder,
        strokeWidth: selection.borderWidth,
        dash: [selection.dash, selection.dash * 2],
        lineCap: "round",
      },
    },
  });
}

/** Rubber-band rectangle drawn while shift-dragging on the pane. */
export function defaultSelectionBox(
  args: SelectionBoxCustomArgs,
  context: FlowDiagramContext<DefaultFlowConfig>,
): Widget {
  return selectionRect(args.rect.width, args.rect.height, context);
}

/** Dashed frame around a multi-node selection. */
export function defaultNodesSelectionRect(
  args: NodesSelectionRectCustomArgs,
  context: FlowDiagramContext<DefaultFlowConfig>,
): Widget {
  return selectionRect(args.rect.width, args.rect.height, context);
}
