import {
  BoxDecoration,
  BoxShadow,
  Center,
  Column,
  Container,
  MainAxisSize,
  type Widget,
} from "flitterjs";
import type {
  ControlsCustomArgs,
  ControlButtonCustomArgs,
  FlowDiagramContext,
} from "../../../../../../../src/engine";
import type { DefaultFlowConfig } from "../config";
import { IconPaint } from "./paint";
import { icons } from "./icons";

export function defaultControls(
  args: ControlsCustomArgs,
  ctx: FlowDiagramContext<DefaultFlowConfig>,
): Widget {
  const { colors, controls } = ctx.config;
  const buttons: Widget[] = [];
  if (controls.showZoom) buttons.push(args.zoomIn, args.zoomOut);
  if (controls.showFitView) buttons.push(args.fitView);
  if (controls.showInteractive) buttons.push(args.interactive);
  return Container({
    decoration: new BoxDecoration({
      color: colors.controlsBorder,
      boxShadow: [
        new BoxShadow({
          color: colors.controlsShadow,
          offset: { x: 0, y: 0 },
          blurRadius: 2,
        }),
      ],
    }),
    child: Column({
      mainAxisSize: MainAxisSize.min,
      children: buttons,
    }),
  });
}

export function defaultControlButton(
  args: ControlButtonCustomArgs,
  ctx: FlowDiagramContext<DefaultFlowConfig>,
): Widget {
  const { colors, controls } = ctx.config;
  const icon = {
    zoomIn: icons.plus,
    zoomOut: icons.minus,
    fitView: icons.fitView,
    interactive: args.isInteractive ? icons.unlock : icons.lock,
  }[args.kind];
  return Container({
    width: controls.buttonSize,
    height: controls.buttonSize,
    color: args.isHovered
      ? colors.controlsBackgroundHover
      : colors.controlsBackground,
    child: Center({
      child: IconPaint({
        d: icon.d,
        viewBox: icon.viewBox,
        size: controls.iconSize,
        color: colors.controlsColor,
      }),
    }),
  });
}
