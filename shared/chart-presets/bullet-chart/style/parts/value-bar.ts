import {
  Alignment,
  Container,
  FractionallySizedBox,
  BoxDecoration,
  type Widget,
} from "flitterjs";
import type { BulletChartContext } from "@flitterjs/chart";
import type { AgBulletChartConfig } from "../config";

export function agValueBar(
  { value: _value, index: _index }: { value: number; index: number; label: string; isHovered: boolean; isDimmed: boolean },
  context: BulletChartContext<AgBulletChartConfig>,
): Widget {
  const { bullet } = context.config;
  const isVertical = context.direction === "vertical";
  return FractionallySizedBox({
    alignment: isVertical ? Alignment.bottomCenter : Alignment.centerLeft,
    widthFactor: isVertical ? bullet.valueBarHeightRatio : undefined,
    heightFactor: isVertical ? undefined : bullet.valueBarHeightRatio,
    child: Container({
      width: Infinity,
      height: Infinity,
      decoration: new BoxDecoration({ color: bullet.valueBarColor }),
    }),
  });
}
