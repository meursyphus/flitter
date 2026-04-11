import {
  SizedBox,
  type Widget,
} from "flitter-core";
import { toastPointTooltipArea } from "../cartesian";

type HoveredPoint = {
  index: number;
  legend: string;
} | null;

type LineLikeTooltipContext = {
  legends: string[];
  config: {
    tooltip: { enabled: boolean };
    colors: string[];
  };
  getPointPosition: (index: number, legend: string) => { x: number; y: number } | null;
};

export function toastLineLikeTooltipArea(
  {
    tooltip,
    hoveredPoint,
  }: {
    tooltip: Widget | null;
    hoveredPoint: HoveredPoint;
  },
  ctx: LineLikeTooltipContext,
): Widget {
  if (hoveredPoint == null || tooltip == null || !ctx.config.tooltip.enabled) {
    return SizedBox.shrink();
  }

  const point = ctx.getPointPosition(hoveredPoint.index, hoveredPoint.legend);
  if (point == null) return SizedBox.shrink();

  const legendIdx = ctx.legends.indexOf(hoveredPoint.legend);
  const color = ctx.config.colors[legendIdx % ctx.config.colors.length];

  return toastPointTooltipArea({
    tooltip,
    anchorPoint: point,
    enabled: true,
    dotColor: color,
  });
}
