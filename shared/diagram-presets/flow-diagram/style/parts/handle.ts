import {
  Border,
  BoxDecoration,
  Center,
  Container,
  SizedBox,
  type Widget,
} from "flitterjs";
import type {
  FlowDiagramContext,
  HandleCustomArgs,
} from "@flitterjs/diagram";
import type { DefaultFlowConfig } from "../config";

/** 6px circle on the node border; grows a transparent hit area for easier grabbing. */
export function defaultHandle(
  args: HandleCustomArgs,
  context: FlowDiagramContext<DefaultFlowConfig>,
): Widget {
  const { colors, handle: h } = context.config;
  const { handle, isConnectionCandidate, isValidCandidate, isConnectable } =
    args;
  let color = colors.handleBackground;
  if (isConnectionCandidate)
    color = isValidCandidate ? colors.handleValid : colors.handleInvalid;
  const pad = isConnectable ? h.hitPadding : 0;
  return SizedBox({
    width: handle.width + pad * 2,
    height: handle.height + pad * 2,
    child: Center({
      child: Container({
        width: handle.width,
        height: handle.height,
        decoration: new BoxDecoration({
          shape: "circle",
          color,
          border: Border.all({
            color: colors.handleBorder,
            width: h.borderWidth,
          }),
        }),
      }),
    }),
  });
}
