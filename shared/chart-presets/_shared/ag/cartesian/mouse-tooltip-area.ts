import {
  StatefulWidget,
  State,
  Stack,
  StackFit,
  AnimatedPositioned,
  LayoutBuilder,
  GlobalKey,
  ConstraintsTransformBox,
  GestureDetector,
  SizedBox,
  Curves,
  ZIndex,
  type Widget,
} from "flitter-ui";

const TOOLTIP_OFFSET = 12;
const ANIMATION_DURATION = 150;
const MOUSE_THRESHOLD = 3;

export type AgMouseTooltipOverlayArgs = {
  mouseX: number;
  mouseY: number;
  hasMousePosition: boolean;
};

class _AgMouseTooltipArea extends StatefulWidget {
  overlay: ((args: AgMouseTooltipOverlayArgs) => Widget | null) | undefined;
  tooltip: Widget | null;

  constructor({
    overlay,
    tooltip,
  }: {
    overlay?: (args: AgMouseTooltipOverlayArgs) => Widget | null;
    tooltip: Widget | null;
  }) {
    super();
    this.overlay = overlay;
    this.tooltip = tooltip;
  }

  createState() {
    return new _AgMouseTooltipAreaState();
  }
}

class _AgMouseTooltipAreaState extends State<_AgMouseTooltipArea> {
  hasMousePosition = false;
  mouseX = 0;
  mouseY = 0;
  wasVisible = false;
  tooltipKey = new GlobalKey();
  tooltipWidth = 220;
  tooltipHeight = 100;
  measurementScheduled = false;

  private measureTooltip(): void {
    if (this.measurementScheduled) return;
    this.measurementScheduled = true;
    this.element.scheduler.addPostFrameCallbacks(() => {
      this.measurementScheduled = false;
      const element = this.tooltipKey.buildOwner?.findByGlobalKey(
        this.tooltipKey,
      );
      // A fast move can remove the tooltip before this post-frame measurement.
      if (element == null || this.widget.tooltip == null) return;
      const size = element.renderObject.size;
      if (!size) return;
      if (
        size.width === this.tooltipWidth &&
        size.height === this.tooltipHeight
      )
        return;
      this.setState(() => {
        this.tooltipWidth = size.width;
        this.tooltipHeight = size.height;
      });
    });
  }

  private getLocalPosition(e: MouseEvent): { x: number; y: number } {
    const ro = this.element.renderObject;
    const view = ro.renderOwner.renderContext.view;
    const rect = view.getBoundingClientRect();
    const flitterGlobalX = e.clientX - rect.left;
    const flitterGlobalY = e.clientY - rect.top;
    const overlayGlobal = ro.localToGlobal();
    return {
      x: flitterGlobalX - overlayGlobal.x,
      y: flitterGlobalY - overlayGlobal.y,
    };
  }

  override build(): Widget {
    const { overlay, tooltip } = this.widget;

    if (tooltip != null) this.measureTooltip();

    const isVisible = tooltip != null;
    const positionDuration =
      !this.wasVisible && isVisible ? 0 : ANIMATION_DURATION;
    this.wasVisible = isVisible;

    const overlayWidget = overlay?.({
      mouseX: this.mouseX,
      mouseY: this.mouseY,
      hasMousePosition: this.hasMousePosition,
    });
    // Remove the tooltip on leave; retaining a transparent subtree can leave
    // SVG shadow/filter pixels behind when the mark subtree is reconciled.
    const showTooltip = tooltip;

    return LayoutBuilder({
      builder: (_, constraints) => {
        const children: Widget[] = [
          GestureDetector({
            behavior: "translucent",
            cursor: "default",
            onMouseMove: (e: MouseEvent) => {
              const local = this.getLocalPosition(e);
              const dx = local.x - this.mouseX;
              const dy = local.y - this.mouseY;
              if (dx * dx + dy * dy < MOUSE_THRESHOLD * MOUSE_THRESHOLD) return;
              this.setState(() => {
                this.hasMousePosition = true;
                this.mouseX = local.x;
                this.mouseY = local.y;
              });
            },
            child: SizedBox.expand(),
          }),
        ];

        if (overlayWidget != null) {
          children.push(overlayWidget);
        }

        if (showTooltip != null) {
          children.push(
            AnimatedPositioned({
              duration: positionDuration,
              curve: Curves.easeOut,
              left: Math.max(
                4,
                Math.min(
                  this.mouseX - this.tooltipWidth / 2,
                  constraints.maxWidth - this.tooltipWidth - 4,
                ),
              ),
              top: Math.max(
                4,
                Math.min(
                  this.mouseY - TOOLTIP_OFFSET - this.tooltipHeight,
                  constraints.maxHeight - this.tooltipHeight - 4,
                ),
              ),
              child: ConstraintsTransformBox({
                constraintsTransform: ConstraintsTransformBox.unconstrained,
                child: ZIndex({
                  zIndex: 9999,
                  child: SizedBox({
                    key: this.tooltipKey,
                    child: showTooltip,
                  }),
                }),
              }),
            }),
          );
        }

        return Stack({
          fit: StackFit.passthrough,
          clipped: false,
          children,
        });
      },
    });
  }
}

export function agMouseTooltipArea({
  overlay,
  tooltip,
  enabled,
}: {
  overlay?: (args: AgMouseTooltipOverlayArgs) => Widget | null;
  tooltip: Widget | null;
  enabled: boolean;
}): Widget {
  if (!enabled) return SizedBox.shrink();
  return new _AgMouseTooltipArea({ overlay, tooltip });
}
