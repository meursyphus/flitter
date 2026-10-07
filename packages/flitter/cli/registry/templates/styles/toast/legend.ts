import {
  Row,
  SizedBox,
  Text,
  TextStyle,
  EdgeInsets,
  Padding,
  MainAxisSize,
  Opacity,
  Container,
  BoxDecoration,
  type Widget,
} from "flitter-core";
import { CheckBox } from "./checkbox";
import type { ToastBaseConfig } from "./cartesian/config";

type ToastLegendConfig = Pick<ToastBaseConfig, "colors" | "font" | "legend">;

export function toastLegend<TConfig extends ToastLegendConfig>(
  { name, index, isVisible }: { name: string; index: number; isVisible?: boolean },
  context: {
    config: TConfig;
    isSeriesVisible?(legend: string): boolean;
  },
  { markerShape }: { markerShape?: "checkbox" | "circle" } = {},
): Widget {
  const { colors, font, legend } = context.config;
  const color = colors[index % colors.length];
  const visible = isVisible ?? context.isSeriesVisible?.(name) ?? true;

  const marker =
    markerShape === "circle"
      ? Container({
          width: 10,
          height: 10,
          decoration: new BoxDecoration({ color, shape: "circle" }),
        })
      : CheckBox({ checked: visible, color, size: 14 });

  const content = Padding({
    padding: EdgeInsets.symmetric({ horizontal: 8 }),
    child: Row({
      mainAxisSize: MainAxisSize.min,
      children: [
        marker,
        SizedBox({ width: 6 }),
        Text(name, {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: font.size,
            color: legend.color,
          }),
        }),
      ],
    }),
  });

  return visible
    ? content
    : Opacity({
        opacity: 0.4,
        child: content,
      });
}
