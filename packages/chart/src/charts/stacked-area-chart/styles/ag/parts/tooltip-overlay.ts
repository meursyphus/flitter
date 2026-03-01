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
import { StackedAreaChartProvider } from "@headless/stacked-area-chart/provider";
import type { AgBaseConfig } from "@shared/styles/ag/config";
import { agTooltipContent } from "@shared/styles/ag";

const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;

class _StackedAreaTooltipOverlay extends StatefulWidget {
  child: Widget;

  constructor({ child }: { child: Widget }) {
    super();
    this.child = child;
  }

  createState() {
    return new _StackedAreaTooltipOverlayState();
  }
}

class _StackedAreaTooltipOverlayState extends State<_StackedAreaTooltipOverlay> {
  pointPixelX = 0;
  pointPixelY = 0;
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

  override build(context: BuildContext): Widget {
    const ctx = StackedAreaChartProvider.of(context);
    const config: AgBaseConfig = ctx.config;
    const { tooltip } = config;
    const { hoveredPoint } = ctx;

    // Compute cumulative values for pixel position calculation
    const datasets = ctx.data.datasets;

    // Resolve tooltip data from hovered point
    let tooltipData: {
      label: string;
      legend: string;
      color: string;
      value: number;
      pixelX: number;
      pixelY: number;
    } | null = null;

    if (hoveredPoint != null && ctx.scale != null) {
      const { index, legend } = hoveredPoint;
      const datasetIdx = datasets.findIndex((d) => d.legend === legend);
      const dataset = datasets[datasetIdx];
      if (dataset != null && index < dataset.values.length) {
        const legendIdx = ctx.legends.indexOf(legend);
        const color = config.colors.fills[legendIdx % config.colors.fills.length];
        const label = ctx.data.labels[index] ?? "";
        const rawValue = dataset.values[index];
        const scale = ctx.scale;
        const numPoints = dataset.values.length;
        const ro = this.element.renderObject;
        const size = ro.size;
        const range = scale.max - scale.min;

        // Cumulative value at this point (sum of this + all below)
        let cumulativeValue = 0;
        for (let i = 0; i <= datasetIdx; i++) {
          cumulativeValue += datasets[i].values[index];
        }

        const px = numPoints > 1 ? (index * size.width) / (numPoints - 1) : size.width / 2;
        const py = size.height - (size.height * (cumulativeValue - scale.min)) / range;
        tooltipData = { label, legend, color, value: rawValue, pixelX: px, pixelY: py };
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

      // Mouse tracking layer for closest-point hover detection
      Positioned.fill({
        child: GestureDetector({
          cursor: "default",
          onMouseMove: (e: MouseEvent) => {
            const local = this.getLocalPosition(e);
            const ro = this.element.renderObject;
            const size = ro.size;
            if (size.width <= 0 || size.height <= 0) return;
            if (ctx.scale == null) return;

            const scale = ctx.scale;
            const range = scale.max - scale.min;
            let closestIndex = -1;
            let closestLegend = "";
            let minDist = Infinity;

            // For stacked area, use cumulative values for y-position
            for (let di = 0; di < datasets.length; di++) {
              const dataset = datasets[di];
              const numPoints = dataset.values.length;
              for (let i = 0; i < numPoints; i++) {
                // Cumulative value at this point
                let cumulativeValue = 0;
                for (let j = 0; j <= di; j++) {
                  cumulativeValue += datasets[j].values[i];
                }
                const px = numPoints > 1 ? (i * size.width) / (numPoints - 1) : size.width / 2;
                const py = size.height - (size.height * (cumulativeValue - scale.min)) / range;
                const dx = local.x - px;
                const dy = local.y - py;
                const dist = dx * dx + dy * dy;
                if (dist < minDist) {
                  minDist = dist;
                  closestIndex = i;
                  closestLegend = dataset.legend;
                }
              }
            }

            if (closestIndex >= 0) {
              const hp = ctx.hoveredPoint;
              if (hp == null || hp.index !== closestIndex || hp.legend !== closestLegend) {
                ctx.hoverPoint(closestIndex, closestLegend);
              }
            }
          },
          onMouseLeave: () => {
            ctx.unhoverPoint();
          },
          child: SizedBox.expand(),
        }),
      }),
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
                  child: agTooltipContent({
                    label: showData.label,
                    legend: showData.legend,
                    color: showData.color,
                    value: showData.value,
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

export function StackedAreaTooltipOverlay({
  child,
  config,
}: {
  child: Widget;
  config: AgBaseConfig;
}): Widget {
  if (!config.tooltip.enabled) return child;
  return new _StackedAreaTooltipOverlay({ child });
}
