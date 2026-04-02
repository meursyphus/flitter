import {
  StatefulWidget,
  State,
  Stack,
  StackFit,
  Positioned,
  GestureDetector,
  AnimatedPositioned,
  AnimatedOpacity,
  FractionalTranslation,
  ConstraintsTransformBox,
  Offset,
  Curves,
  SizedBox,
  ZIndex,
  type Widget,
  type BuildContext,
} from "flitter-core";
import type { BubbleChartCustom } from "flitter-ui/chart";
import type { AgBubbleChartConfig } from "../config";
import { DataView } from "../../base/data-view";
import { BubbleChartProvider } from "flitter-ui/chart";

export function agDataView(
  ...[args, context]: Parameters<BubbleChartCustom<AgBubbleChartConfig>["dataView"]>
): Widget {
  const child = DataView(args, context);
  const config = context.config;
  if (!config.tooltip.enabled) return child;
  return new _BubbleTooltipOverlay({ child });
}

const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;
const MOUSE_THRESHOLD = 3;

class _BubbleTooltipOverlay extends StatefulWidget {
  child: Widget;

  constructor({ child }: { child: Widget }) {
    super();
    this.child = child;
  }

  createState() {
    return new _BubbleTooltipOverlayState();
  }
}

class _BubbleTooltipOverlayState extends State<_BubbleTooltipOverlay> {
  mouseX = 0;
  mouseY = 0;
  wasVisible = false;
  lastTooltipWidget: Widget | null = null;

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

  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
    const config: AgBubbleChartConfig = ctx.config;
    const { hoveredBubble } = ctx;

    // Resolve tooltip data from hovered bubble
    let tooltipWidget: Widget | null = null;

    if (hoveredBubble != null && ctx.scale != null) {
      const { index, legend } = hoveredBubble;
      const dataset = ctx.data.datasets.find((d) => d.legend === legend);
      const point = dataset?.data[index];
      if (point != null) {
        const legendIdx = ctx.legends.indexOf(legend);
        const color = config.colors.fills[legendIdx % config.colors.fills.length];
        tooltipWidget = ctx.custom.tooltip(
          { label: point.label, items: [{ legend, color, value: point.value }] },
          ctx,
        );
      }
    }

    // Keep last tooltip widget for fade-out animation
    if (tooltipWidget != null) {
      this.lastTooltipWidget = tooltipWidget;
    }

    const isVisible = tooltipWidget != null;

    // Use duration 0 for first appearance to avoid sliding from old position
    const positionDuration = !this.wasVisible && isVisible ? 0 : ANIMATION_DURATION;
    this.wasVisible = isVisible;

    const showWidget = this.lastTooltipWidget;

    const children: Widget[] = [
      this.widget.child,

      // Mouse tracking layer for position updates only
      // onMouseLeave is handled by headless (dataView wrapper), only onMouseMove for position tracking
      Positioned.fill({
        child: GestureDetector({
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
      }),
    ];

    // Tooltip at mouse position
    if (showWidget != null) {
      children.push(
        AnimatedPositioned({
          duration: positionDuration,
          curve: Curves.easeOut,
          left: this.mouseX,
          top: this.mouseY - 12,
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
                  child: showWidget,
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
