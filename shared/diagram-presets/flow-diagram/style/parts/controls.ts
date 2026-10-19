import {
  BoxDecoration,
  BoxShadow,
  Center,
  Column,
  Container,
  MainAxisSize,
  type Widget,
} from "flitter-ui";
import type {
  ControlsCustomArgs,
  FlowDiagramContext,
} from "flitter-ui/diagram";
import type { DefaultFlowConfig } from "../config";
import { IconPaint } from "./paint";
import { icons } from "./icons";

export function defaultControls(
  args: ControlsCustomArgs,
  ctx: FlowDiagramContext<DefaultFlowConfig>,
): Widget {
  const { colors, controls } = ctx.config;
  const buttons: {
    icon: { d: string; viewBox: [number, number] };
    onClick: () => void;
  }[] = [];
  if (controls.showZoom) {
    buttons.push({
      icon: icons.plus,
      onClick: () => args.zoomIn({ duration: controls.zoomDuration }),
    });
    buttons.push({
      icon: icons.minus,
      onClick: () => args.zoomOut({ duration: controls.zoomDuration }),
    });
  }
  if (controls.showFitView)
    buttons.push({
      icon: icons.fitView,
      onClick: () => args.fitView({ duration: controls.fitViewDuration }),
    });
  if (controls.showInteractive)
    buttons.push({
      icon: args.isInteractive ? icons.unlock : icons.lock,
      onClick: args.toggleInteractive,
    });
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
      children: buttons.map((button) =>
        args.action(
          (isHovered) =>
            Container({
              width: controls.buttonSize,
              height: controls.buttonSize,
              color: isHovered
                ? colors.controlsBackgroundHover
                : colors.controlsBackground,
              child: Center({
                child: IconPaint({
                  d: button.icon.d,
                  viewBox: button.icon.viewBox,
                  size: controls.iconSize,
                  color: colors.controlsColor,
                }),
              }),
            }),
          button.onClick,
        ),
      ),
    }),
  });
}
