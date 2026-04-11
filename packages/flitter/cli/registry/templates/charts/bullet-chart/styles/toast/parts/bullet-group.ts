import {
  Container,
  EdgeInsets,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { BulletChartContext } from "@headless/bullet-chart/types";
import type { ToastBulletChartConfig } from "../config";

export function toastBulletGroup(
  {
    bulletBox,
    isHovered,
    isDimmed,
  }: {
    bulletBox: Widget;
    index: number;
    label: string;
    isHovered: boolean;
    isDimmed: boolean;
  },
  context: BulletChartContext<ToastBulletChartConfig>,
): Widget {
  const { scale, config, direction } = context;
  if (scale == null) return SizedBox.shrink();

  return Container({
    width: Infinity,
    height: Infinity,
    padding: EdgeInsets.symmetric(direction === "vertical" ? { horizontal: config.bullet.gap } : { vertical: config.bullet.gap }),
    child: bulletBox,
  });
}
