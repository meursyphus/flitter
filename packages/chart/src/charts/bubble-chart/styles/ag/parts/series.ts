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
import type { BubbleChartCustom } from "@headless/bubble-chart/types";
import type { AgBubbleChartConfig } from "../config";
import { Series } from "../../../base/series";
import { BubbleChartProvider } from "@headless/bubble-chart/provider";
import { agTooltipContent } from "@styles/ag";

export function agSeries(
  ...[args, context]: Parameters<BubbleChartCustom<AgBubbleChartConfig>["series"]>
): Widget {
  const child = Series(args, context);
  const config = context.config;
  if (!config.tooltip.enabled) return child;
  return new _BubbleTooltipOverlay({ child });
}

const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;

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
    const ctx = BubbleChartProvider.of(context);
    const config: AgBubbleChartConfig = ctx.config;
    const { tooltip } = config;
    const { hoveredBubble } = ctx;

    // Resolve tooltip data from hovered bubble
    let tooltipData: {
      label: string;
      legend: string;
      color: string;
      value: number;
      normX: number;
      normY: number;
    } | null = null;

    if (hoveredBubble != null && ctx.scale != null) {
      const { index, legend } = hoveredBubble;
      const dataset = ctx.data.datasets.find((d) => d.legend === legend);
      const point = dataset?.data[index];
      if (point != null) {
        const legendIdx = ctx.legends.indexOf(legend);
        const color = config.colors.fills[legendIdx % config.colors.fills.length];
        const scale = ctx.scale;
        const normX = (point.x - scale.x.min) / (scale.x.max - scale.x.min);
        const normY = (point.y - scale.y.min) / (scale.y.max - scale.y.min);
        tooltipData = { label: point.label, legend, color, value: point.value, normX, normY };
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
      const ro = this.element.renderObject;
      const size = ro.size;
      if (size.width > 0 && size.height > 0) {
        this.pointPixelX = tooltipData.normX * size.width;
        this.pointPixelY = (1 - tooltipData.normY) * size.height;
      }
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
            let closestIndex = -1;
            let closestLegend = "";
            let minDist = Infinity;

            for (const dataset of ctx.data.datasets) {
              for (let i = 0; i < dataset.data.length; i++) {
                const pt = dataset.data[i];
                const normX = (pt.x - scale.x.min) / (scale.x.max - scale.x.min);
                const normY = (pt.y - scale.y.min) / (scale.y.max - scale.y.min);
                const px = normX * size.width;
                const py = (1 - normY) * size.height;
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
              const hb = ctx.hoveredBubble;
              if (hb == null || hb.index !== closestIndex || hb.legend !== closestLegend) {
                ctx.hoverBubble(closestIndex, closestLegend);
              }
            }
          },
          onMouseLeave: () => {
            ctx.unhoverBubble();
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
