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
} from "flitter-core";
import type { HeatmapContext } from "flitter-ui/chart";
import type { AgHeatmapChartConfig } from "../config";
import { interpolateColor } from "./segment";

const TOOLTIP_OFFSET = 12;
const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;
const MOUSE_THRESHOLD = 3;

class _AgHeatmapTooltipOverlay extends StatefulWidget {
  child: Widget;
  chartContext: HeatmapContext<AgHeatmapChartConfig>;

  constructor({
    child,
    chartContext,
  }: {
    child: Widget;
    chartContext: HeatmapContext<AgHeatmapChartConfig>;
  }) {
    super();
    this.child = child;
    this.chartContext = chartContext;
  }

  createState() {
    return new _AgHeatmapTooltipOverlayState();
  }
}

class _AgHeatmapTooltipOverlayState extends State<_AgHeatmapTooltipOverlay> {
  mouseX = 0;
  mouseY = 0;
  wasVisible = false;
  lastTooltipData: {
    label: string;
    color: string;
    value: number;
  } | null = null;

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
    const ctx = this.widget.chartContext;
    const config = ctx.config;
    const hovered = ctx.hoveredSegment;

    let tooltipData: {
      label: string;
      color: string;
      value: number;
    } | null = null;

    if (hovered != null) {
      const { min, max } = ctx.scale;
      const fraction =
        max === min ? 0.5 : (hovered.value - min) / (max - min);
      const color = interpolateColor(config.heatmap.colorRange, fraction);
      tooltipData = {
        label: `${hovered.yLabel} / ${hovered.xLabel}`,
        color,
        value: hovered.value,
      };
    }

    if (tooltipData != null) {
      this.lastTooltipData = tooltipData;
    }

    const isVisible = tooltipData != null;
    const positionDuration =
      !this.wasVisible && isVisible ? 0 : ANIMATION_DURATION;
    this.wasVisible = isVisible;

    const showData = this.lastTooltipData;

    const children: Widget[] = [
      this.widget.child,
      // Transparent mouse-tracking layer (translucent so segments below still receive hit tests)
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

    if (showData != null) {
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
                  child: ctx.custom.tooltip(
                    { label: showData.label, items: [{ legend: "Value", color: showData.color, value: showData.value }] },
                    ctx,
                  ),
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

export function AgHeatmapTooltipOverlay({
  child,
  context,
}: {
  child: Widget;
  context: HeatmapContext<AgHeatmapChartConfig>;
}): Widget {
  if (!context.config.tooltip.enabled) return child;
  return new _AgHeatmapTooltipOverlay({ child, chartContext: context });
}
