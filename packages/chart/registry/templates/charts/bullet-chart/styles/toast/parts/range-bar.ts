import {
  Container,
  BoxDecoration,
  type Widget,
} from "flitter-core";
import type { BulletChartContext } from "@headless/bullet-chart/types";
import type { ToastBulletChartConfig } from "../config";

export function toastRangeBar(
  { rangeIndex }: { rangeValue: number; rangeIndex: number; index: number; label: string; isHovered: boolean; isDimmed: boolean },
  context: BulletChartContext<ToastBulletChartConfig>,
): Widget {
  const { bullet } = context.config;
  const color = bullet.rangeColors[rangeIndex % bullet.rangeColors.length];

  return Container({
    width: Infinity,
    height: Infinity,
    decoration: new BoxDecoration({ color }),
  });
}
