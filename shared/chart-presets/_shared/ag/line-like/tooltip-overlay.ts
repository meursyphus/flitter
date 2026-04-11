import {
  StatefulWidget,
  State,
  Stack,
  StackFit,
  AnimatedPositioned,
  AnimatedOpacity,
  FractionalTranslation,
  ConstraintsTransformBox,
  Offset,
  Curves,
  ZIndex,
  type Widget,
  type BuildContext,
} from "flitter-ui";
import { LineChartProvider } from "flitter-ui/chart";
import type { AgCartesianBaseConfig } from "../cartesian/config";

const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;

class _AgLineLikeTooltipOverlay extends StatefulWidget {
  child: Widget;

  constructor({ child }: { child: Widget }) {
    super();
    this.child = child;
  }

  createState() {
    return new _AgLineLikeTooltipOverlayState();
  }
}

class _AgLineLikeTooltipOverlayState extends State<_AgLineLikeTooltipOverlay> {
  pointPixelX = 0;
  pointPixelY = 0;
  wasVisible = false;
  lastTooltipData: {
    label: string;
    legend: string;
    color: string;
    value: number;
  } | null = null;

  override build(context: BuildContext): Widget {
    const ctx = LineChartProvider.of(context);
    const config: AgCartesianBaseConfig = ctx.config;
    const { hoveredPoint } = ctx;

    // Resolve tooltip data from hovered point
    let tooltipData: {
      label: string;
      legend: string;
      color: string;
      value: number;
      pixelX: number;
      pixelY: number;
    } | null = null;

    if (hoveredPoint != null) {
      const { index, legend } = hoveredPoint;
      const dataset = ctx.data.datasets.find((d) => d.legend === legend);
      const point = ctx.getPointPosition(index, legend);
      if (dataset != null && index < dataset.values.length) {
        const legendIdx = ctx.legends.indexOf(legend);
        const color = config.colors.fills[legendIdx % config.colors.fills.length];
        const label = ctx.data.labels[index] ?? "";
        const value = dataset.values[index];
        if (point != null) {
          tooltipData = {
            label,
            legend,
            color,
            value,
            pixelX: point.x,
            pixelY: point.y,
          };
        }
      }
    }

    // Keep last tooltip data for fade-out animation
    if (tooltipData != null) {
      this.lastTooltipData = {
        label: tooltipData.label,
        legend: tooltipData.legend,
        color: tooltipData.color,
        value: tooltipData.value,
      };
      this.pointPixelX = tooltipData.pixelX;
      this.pointPixelY = tooltipData.pixelY;
    }

    const isVisible = tooltipData != null;
    const positionDuration = !this.wasVisible && isVisible ? 0 : ANIMATION_DURATION;
    this.wasVisible = isVisible;

    const showData = this.lastTooltipData;

    const children: Widget[] = [
      this.widget.child,
    ];

    // Tooltip at hovered point position
    if (showData != null) {
      children.push(
        AnimatedPositioned({
          duration: positionDuration,
          curve: Curves.easeOut,
          left: this.pointPixelX,
          top: this.pointPixelY,
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
                    { label: showData.label, items: [{ legend: showData.legend, color: showData.color, value: showData.value }] },
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

/**
 * Wraps a series widget with an AG-style tooltip overlay for line-like charts
 * (line chart, area chart). Uses LineChartProvider for hover state.
 */
export function AgLineLikeTooltipOverlay({
  child,
  config,
}: {
  child: Widget;
  config: AgCartesianBaseConfig;
}): Widget {
  if (!config.tooltip.enabled) return child;
  return new _AgLineLikeTooltipOverlay({ child });
}
