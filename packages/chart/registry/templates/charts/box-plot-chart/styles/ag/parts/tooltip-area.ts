import {
  StatefulWidget,
  State,
  Stack,
  StackFit,
  AnimatedPositioned,
  AnimatedOpacity,
  FractionalTranslation,
  ConstraintsTransformBox,
  GestureDetector,
  SizedBox,
  Offset,
  Curves,
  ZIndex,
  type Widget,
} from "flitter-core";
import type { BoxPlotChartCustom } from "@headless/box-plot-chart/types";
import type { AgBoxPlotChartConfig } from "../config";

const TOOLTIP_OFFSET = 12;
const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;
const MOUSE_THRESHOLD = 3;

class _AgTooltipArea extends StatefulWidget {
  tooltip: Widget | null;

  constructor({ tooltip }: { tooltip: Widget | null }) {
    super();
    this.tooltip = tooltip;
  }

  createState() {
    return new _AgTooltipAreaState();
  }
}

class _AgTooltipAreaState extends State<_AgTooltipArea> {
  mouseX = 0;
  mouseY = 0;
  wasVisible = false;
  lastTooltip: Widget | null = null;

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
    const { tooltip } = this.widget;
    if (tooltip != null) {
      this.lastTooltip = tooltip;
    }

    const isVisible = tooltip != null;
    const positionDuration = !this.wasVisible && isVisible ? 0 : ANIMATION_DURATION;
    this.wasVisible = isVisible;

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
            this.mouseX = local.x;
            this.mouseY = local.y;
          });
        },
        child: SizedBox.expand(),
      }),
    ];

    if (this.lastTooltip != null) {
      children.push(
        AnimatedPositioned({
          duration: positionDuration,
          curve: Curves.easeOut,
          left: this.mouseX,
          top: this.mouseY - TOOLTIP_OFFSET,
          child: AnimatedOpacity({
            duration: FADE_DURATION,
            opacity: isVisible ? 1 : 0,
            curve: Curves.easeOut,
            child: FractionalTranslation({
              translation: new Offset({ x: -0.5, y: -1 }),
              child: ConstraintsTransformBox({
                constraintsTransform: ConstraintsTransformBox.unconstrained,
                child: ZIndex({
                  zIndex: 9999,
                  child: this.lastTooltip,
                }),
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
  }
}

export function agTooltipArea(
  ...[{ tooltip }, ctx]: Parameters<BoxPlotChartCustom<AgBoxPlotChartConfig>["tooltipArea"]>
): Widget {
  if (!ctx.config.tooltip.enabled) return SizedBox.shrink();
  return new _AgTooltipArea({ tooltip });
}
