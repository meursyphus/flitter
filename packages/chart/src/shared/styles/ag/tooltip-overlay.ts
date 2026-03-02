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
import type { AgBaseConfig } from "./config";
import { tooltipContent } from "./tooltip";

const TOOLTIP_OFFSET = 12;
const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;

type BarChartLikeContext = {
  hoveredBar: { index: number; legend: string } | null;
  unhoverBar(): void;
  data: { datasets: { legend: string; values: number[] }[]; labels: string[] };
  legends: string[];
  config: AgBaseConfig;
};

class _AgTooltipOverlay extends StatefulWidget {
  child: Widget;
  chartContext: BarChartLikeContext;

  constructor({ child, chartContext }: { child: Widget; chartContext: BarChartLikeContext }) {
    super();
    this.child = child;
    this.chartContext = chartContext;
  }

  createState() {
    return new _AgTooltipOverlayState();
  }
}

class _AgTooltipOverlayState extends State<_AgTooltipOverlay> {
  mouseX = 0;
  mouseY = 0;
  wasVisible = false;
  lastTooltipData: {
    label: string;
    legend: string;
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
    const { hoveredBar } = ctx;

    // Resolve tooltip data from hovered bar
    let tooltipData: {
      label: string;
      legend: string;
      color: string;
      value: number;
    } | null = null;

    if (hoveredBar != null) {
      const { index, legend } = hoveredBar;
      const dataset = ctx.data.datasets.find((d) => d.legend === legend);
      const legendIdx = ctx.legends.indexOf(legend);
      const color =
        config.colors.fills[legendIdx % config.colors.fills.length];
      const value = dataset?.values[index] ?? 0;
      const label = ctx.data.labels[index] ?? "";
      tooltipData = { label, legend, color, value };
    }

    // Keep last tooltip data for fade-out animation
    if (tooltipData != null) {
      this.lastTooltipData = tooltipData;
    }

    const isVisible = tooltipData != null;

    // Use duration 0 for first appearance to avoid sliding from old position
    const positionDuration =
      !this.wasVisible && isVisible ? 0 : ANIMATION_DURATION;
    this.wasVisible = isVisible;

    const showData = this.lastTooltipData;

    const children: Widget[] = [
      this.widget.child,

      // Transparent mouse-tracking layer
      Positioned.fill({
        child: GestureDetector({
          cursor: "default",
          onMouseMove: (e: MouseEvent) => {
            const local = this.getLocalPosition(e);
            this.setState(() => {
              this.mouseX = local.x;
              this.mouseY = local.y;
            });
          },
          onMouseLeave: () => {
            ctx.unhoverBar();
          },
          child: SizedBox.expand(),
        }),
      }),
    ];

    // Always render tooltip (for fade-out animation), toggle opacity
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
                  child: tooltipContent({
                    label: showData.label,
                    items: { legend: showData.legend, color: showData.color, value: showData.value },
                    config,
                  }),
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

/**
 * Wraps a series widget with an AG-style mouse-following tooltip overlay.
 * Reads hover state directly from the chart context (2nd arg of series slot).
 * If tooltip.enabled is false, returns the child as-is.
 */
export function AgTooltipOverlay({
  child,
  context,
}: {
  child: Widget;
  context: BarChartLikeContext;
}): Widget {
  if (!context.config.tooltip.enabled) return child;
  return new _AgTooltipOverlay({ child, chartContext: context });
}
