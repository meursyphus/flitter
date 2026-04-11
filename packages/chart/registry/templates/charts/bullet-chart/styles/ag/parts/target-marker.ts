import {
  Alignment,
  Container,
  FractionallySizedBox,
  BoxDecoration,
  type Widget,
} from "flitter-core";
import type { BulletChartContext } from "@headless/bullet-chart/types";
import type { AgBulletChartConfig } from "../config";

export function agTargetMarker(
  { target: _target, index: _index }: { target: number; index: number; label: string; isHovered: boolean; isDimmed: boolean },
  context: BulletChartContext<AgBulletChartConfig>,
): Widget {
  const { bullet } = context.config;
  const isVertical = context.direction === "vertical";
  return FractionallySizedBox({
    alignment: isVertical ? Alignment.topCenter : Alignment.centerLeft,
    widthFactor: isVertical ? bullet.targetMarkerHeightRatio : undefined,
    heightFactor: isVertical ? undefined : bullet.targetMarkerHeightRatio,
    child: Container({
      alignment: isVertical ? Alignment.topCenter : Alignment.centerRight,
      child: Container({
        width: isVertical ? Infinity : bullet.targetMarkerWidth,
        height: isVertical ? bullet.targetMarkerWidth : Infinity,
        decoration: new BoxDecoration({ color: bullet.targetMarkerColor }),
      }),
    }),
  });
}
