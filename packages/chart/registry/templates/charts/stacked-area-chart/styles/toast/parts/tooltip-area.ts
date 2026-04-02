import {
  StatefulWidget,
  State,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { LineChartCustom } from "@headless/line-chart/types";
import type { ToastStackedAreaChartConfig } from "../config";
import { cartesian } from "@styles/toast";

function resolveStackedHoveredPoint(
  hoveredPoint: { index: number; legend: string; x: number; y: number } | null,
  ctx: Parameters<LineChartCustom<ToastStackedAreaChartConfig>["tooltipArea"]>[1],
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

export function toastTooltipArea(
  ...[args, ctx]: Parameters<LineChartCustom<ToastStackedAreaChartConfig>["tooltipArea"]>
) {
  const { tooltip, hoveredPoint } = args;
  return new _ToastTooltipArea({ tooltip, hoveredPoint, ctx });
}

class _ToastTooltipArea extends StatefulWidget {
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
    return new _ToastTooltipAreaState();
  }
}

class _ToastTooltipAreaState extends State<_ToastTooltipArea> {
  override build(): Widget {
    const { tooltip, hoveredPoint, ctx } = this.widget;
    const config: ToastStackedAreaChartConfig = ctx.config;

    if (hoveredPoint == null || tooltip == null || !config.tooltip.enabled) {
      return SizedBox.shrink();
    }

    const stackedPoint = resolveStackedHoveredPoint(
      hoveredPoint,
      ctx,
      this.element.renderObject.size.height,
    );
    if (stackedPoint == null) return SizedBox.shrink();

    const legendIdx = ctx.legends.indexOf(stackedPoint.legend);
    const color = config.colors[legendIdx % config.colors.length];

    return cartesian.toastPointTooltipArea({
      tooltip,
      anchorPoint: { x: stackedPoint.x, y: stackedPoint.y },
      enabled: true,
      dotColor: color,
    });
  }
}
