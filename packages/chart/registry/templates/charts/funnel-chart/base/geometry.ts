import { Path } from "flitter-core";
import type { FunnelStage } from "../types";
import type { FunnelAppearance } from "./config";

export function stageGeometry(
  stage: FunnelStage,
  width: number,
  height: number,
  config: FunnelAppearance,
) {
  const ratio = Math.max(0.1, Math.min(1, config.funnel.widthRatio));
  const plotWidth = width * ratio;
  const gap = Math.min(height * 0.4, Math.max(0, config.funnel.gap));
  const inset = Math.min(6, plotWidth / 4);
  const availableWidth = Math.max(0, plotWidth - inset * 2);
  const topWidth = stage.topWidth * availableWidth;
  const bottomWidth = stage.bottomWidth * availableWidth;
  const top = gap / 2;
  const bottom = height - gap / 2;
  const center = plotWidth / 2;
  const path = new Path();
  path.moveTo({ x: center - topWidth / 2, y: top });
  path.lineTo({ x: center + topWidth / 2, y: top });
  path.lineTo({ x: center + bottomWidth / 2, y: bottom });
  path.lineTo({ x: center - bottomWidth / 2, y: bottom });
  path.close();
  return { path, top, bottom, center, topWidth, bottomWidth, plotWidth };
}

export function stageContains(
  point: { x: number; y: number },
  geometry: ReturnType<typeof stageGeometry>,
): boolean {
  const { top, bottom, center, topWidth, bottomWidth } = geometry;
  if (bottom <= top || point.y < top || point.y > bottom) return false;
  const fraction = (point.y - top) / (bottom - top);
  const halfWidth = (topWidth + (bottomWidth - topWidth) * fraction) / 2;
  return halfWidth > 0 && Math.abs(point.x - center) <= halfWidth;
}
