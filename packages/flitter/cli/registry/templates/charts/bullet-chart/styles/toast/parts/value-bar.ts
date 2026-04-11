import {
  Alignment,
  Border,
  BorderRadius,
  BoxDecoration,
  BoxShadow,
  Container,
  FractionallySizedBox,
  Radius,
  ZIndex,
  type Widget,
} from "flitter-core";
import type { BulletChartContext } from "@headless/bullet-chart/types";
import type { ToastBulletChartConfig } from "../config";

export function toastValueBar(
  { value: _value, index: _index, isHovered }: { value: number; index: number; label: string; isHovered: boolean; isDimmed: boolean },
  context: BulletChartContext<ToastBulletChartConfig>,
): Widget {
  const { bullet } = context.config;
  const isVertical = context.direction === "vertical";

  const decoration = isHovered
    ? new BoxDecoration({
        color: bullet.valueBarColor,
        borderRadius: BorderRadius.all(Radius.circular(4)),
        border: Border.all({ color: "white", width: 4, strokeAlign: 1 }),
        boxShadow: [
          new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 8 }),
        ],
      })
    : new BoxDecoration({
        color: bullet.valueBarColor,
        borderRadius: BorderRadius.all(Radius.circular(4)),
      });

  return ZIndex({
    zIndex: isHovered ? 1 : 0,
    child: FractionallySizedBox({
      alignment: isVertical ? Alignment.bottomCenter : Alignment.centerLeft,
      widthFactor: isVertical ? bullet.valueBarHeightRatio : undefined,
      heightFactor: isVertical ? undefined : bullet.valueBarHeightRatio,
      child: Container({
        width: Infinity,
        height: Infinity,
        decoration,
      }),
    }),
  });
}
