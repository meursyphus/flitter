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
} from "flitter-ui";
import { CheckBox } from "./checkbox";
import type { ToastBaseConfig } from "./cartesian/config";

export function toastLegend(
  { name, index, isVisible }: { name: string; index: number; isVisible?: boolean },
  context: {
    config: ToastBaseConfig;
    isSeriesVisible?(legend: string): boolean;
  },
  { markerShape }: { markerShape?: "checkbox" | "circle" } = {},
): Widget {
  const { colors, font } = context.config;
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
            color: "#333333",
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
