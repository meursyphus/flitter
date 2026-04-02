import {
  StatefulWidget,
  State,
  Stack,
  StackFit,
  AnimatedPositioned,
  AnimatedOpacity,
  FractionalTranslation,
  ConstraintsTransformBox,
  SizedBox,
  Offset,
  Curves,
  ZIndex,
  type Widget,
} from "flitter-core";
import type { LineChartCustom } from "flitter-ui/chart";
import type { AgStackedAreaChartConfig } from "../config";

const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;

function resolveStackedHoveredPoint(
  hoveredPoint: { index: number; legend: string; x: number; y: number } | null,
  ctx: Parameters<LineChartCustom<AgStackedAreaChartConfig>["tooltipArea"]>[1],
  height: number,
) {
  if (hoveredPoint == null || ctx.scale == null) return hoveredPoint;

  const datasetIndex = ctx.data.datasets.findIndex(
    (dataset) => dataset.legend === hoveredPoint.legend,
  );
  if (datasetIndex < 0) return hoveredPoint;

  let cumulative = 0;
  for (let i = 0; i <= datasetIndex; i++) {
    cumulative += ctx.data.datasets[i].values[hoveredPoint.index] ?? 0;
  }

  const range = ctx.scale.max - ctx.scale.min;
  const y = range === 0
    ? height / 2
    : height - (height * (cumulative - ctx.scale.min)) / range;

  return {
    index: hoveredPoint.index,
    legend: hoveredPoint.legend,
    x: hoveredPoint.x,
    y,
  };
}

class _AgTooltipArea extends StatefulWidget {
  tooltip: Widget | null;
  hoveredPoint: { index: number; legend: string; x: number; y: number } | null;
  ctx: any;

  constructor({
    tooltip,
    hoveredPoint,
    ctx,
  }: {
    tooltip: Widget | null;
    hoveredPoint: { index: number; legend: string; x: number; y: number } | null;
    ctx: any;
  }) {
    super();
    this.tooltip = tooltip;
    this.hoveredPoint = hoveredPoint;
    this.ctx = ctx;
  }

  createState() {
    return new _AgTooltipAreaState();
  }
}

class _AgTooltipAreaState extends State<_AgTooltipArea> {
  pointPixelX = 0;
  pointPixelY = 0;
  wasVisible = false;
  lastTooltip: Widget | null = null;

  override build(): Widget {
    const { tooltip, hoveredPoint, ctx } = this.widget;
    const stackedPoint = resolveStackedHoveredPoint(
      hoveredPoint,
      ctx,
      this.element.renderObject.size.height,
    );

    if (tooltip != null && stackedPoint != null) {
      this.lastTooltip = tooltip;
      this.pointPixelX = stackedPoint.x;
      this.pointPixelY = stackedPoint.y;
    }

    const isVisible = tooltip != null && stackedPoint != null;
    const positionDuration = !this.wasVisible && isVisible ? 0 : ANIMATION_DURATION;
    this.wasVisible = isVisible;

    const showTooltip = this.lastTooltip;

    const children: Widget[] = [];

    if (showTooltip != null) {
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
                  child: showTooltip,
                }),
              }),
            }),
          }),
        }),
      );
    }

    if (children.length === 0) return SizedBox.shrink();

    return Stack({
      fit: StackFit.passthrough,
      clipped: false,
      children,
    });
  }
}

export function agTooltipArea(
  ...[{ tooltip, hoveredPoint }, ctx]: Parameters<LineChartCustom<AgStackedAreaChartConfig>["tooltipArea"]>
): Widget {
  if (!ctx.config.tooltip.enabled) return SizedBox.shrink();
  return new _AgTooltipArea({ tooltip, hoveredPoint, ctx });
}
