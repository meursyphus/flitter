import { Border, BorderRadius, BoxDecoration, Center, Container, SizedBox, type Widget } from "flitter-core";
import type { FlowContext, ReconnectHandleBuilderArgs, ResizeControlBuilderArgs } from "../../../headless/flow/types";
import type { XyflowFlowConfig } from "../config";

/** React Flow's NodeResizer look: 1px blue lines and 4px blue squares with a white border. */
export function xyflowResizeControl(args: ResizeControlBuilderArgs, context: FlowContext<XyflowFlowConfig>): Widget {
  const { resize } = context.config;
  const thickness = resize.lineWidth + resize.hitPadding * 2;
  if (args.variant === "line") {
    const horizontal = args.position === "top" || args.position === "bottom";
    return Container({
      width: horizontal ? undefined : thickness,
      height: horizontal ? thickness : undefined,
      alignment: undefined,
      child: Center({
        child: Container({
          width: horizontal ? undefined : resize.lineWidth,
          height: horizontal ? resize.lineWidth : undefined,
          color: resize.color,
        }),
      }),
    });
  }
  const size = resize.handleSize + resize.hitPadding * 2;
  return SizedBox({
    width: size,
    height: size,
    child: Center({
      child: Container({
        width: resize.handleSize,
        height: resize.handleSize,
        decoration: new BoxDecoration({
          color: resize.color,
          border: Border.all({ color: "#ffffff", width: 1 }),
          borderRadius: BorderRadius.circular(1),
        }),
      }),
    }),
  });
}

/** Invisible circle-sized grab area at an edge endpoint (React Flow's edge updater). */
export function xyflowReconnectHandle(args: ReconnectHandleBuilderArgs, _context: FlowContext<XyflowFlowConfig>): Widget {
  return SizedBox({ width: args.size, height: args.size });
}
