import {
  BoxDecoration,
  BoxShadow,
  type BuildContext,
  Center,
  Column,
  Container,
  GestureDetector,
  MainAxisSize,
  State,
  StatefulWidget,
  StatelessWidget,
  type Widget,
} from "flitter-core";
import { FlowProvider } from "../../../headless/flow/provider";
import type { XyflowFlowConfig } from "../config";
import { IconPaint } from "./paint";
import { icons } from "./icons";

class ControlButton extends StatefulWidget {
  constructor(
    readonly props: {
      icon: { d: string; viewBox: [number, number] };
      onClick: () => void;
      last: boolean;
      key?: unknown;
    },
  ) {
    super(props.key);
  }
  override createState(): State<ControlButton> {
    return new ControlButtonState();
  }
}

class ControlButtonState extends State<ControlButton> {
  hovered = false;
  override build(context: BuildContext): Widget {
    const ctx = FlowProvider.of<XyflowFlowConfig>(context);
    const { colors, controls } = ctx.config;
    const size = controls.buttonSize;
    return GestureDetector({
      cursor: "pointer",
      onMouseEnter: () => this.setState(() => (this.hovered = true)),
      onMouseLeave: () => this.setState(() => (this.hovered = false)),
      onMouseDown: (event) => event.stopPropagation(),
      onClick: (event) => {
        event.stopPropagation();
        this.widget.props.onClick();
      },
      child: Container({
        width: size,
        height: size,
        color: this.hovered ? colors.controlsBackgroundHover : colors.controlsBackground,
        child: Center({
          child: IconPaint({
            d: this.widget.props.icon.d,
            viewBox: this.widget.props.icon.viewBox,
            size: controls.iconSize,
            color: colors.controlsColor,
          }),
        }),
      }),
    });
  }
}

/** Zoom in / zoom out / fit view / lock buttons, styled like React Flow's `<Controls>`. */
class XyflowControlsWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = FlowProvider.of<XyflowFlowConfig>(context);
    const { colors, controls } = ctx.config;
    const buttons: { icon: { d: string; viewBox: [number, number] }; onClick: () => void }[] = [];
    if (controls.showZoom) {
      buttons.push({ icon: icons.plus, onClick: () => void ctx.zoomIn({ duration: controls.zoomDuration }) });
      buttons.push({ icon: icons.minus, onClick: () => void ctx.zoomOut({ duration: controls.zoomDuration }) });
    }
    if (controls.showFitView) {
      buttons.push({ icon: icons.fitView, onClick: () => void ctx.fitView({ duration: controls.fitViewDuration }) });
    }
    if (controls.showInteractive) {
      buttons.push({
        icon: ctx.isInteractive ? icons.unlock : icons.lock,
        onClick: () => ctx.setInteractive(!ctx.isInteractive),
      });
    }
    if (buttons.length === 0) return Container({});
    return Container({
      decoration: new BoxDecoration({
        color: colors.controlsBorder,
        boxShadow: [new BoxShadow({ color: colors.controlsShadow, offset: { x: 0, y: 0 }, blurRadius: 2 })],
      }),
      child: Column({
        mainAxisSize: MainAxisSize.min,
        children: buttons.map(
          (button, index) =>
            new ControlButton({
              key: index,
              icon: button.icon,
              onClick: button.onClick,
              last: index === buttons.length - 1,
            }),
        ),
      }),
    });
  }
}

export function XyflowControls(): Widget {
  return new XyflowControlsWidget();
}
