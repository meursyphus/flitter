import {
  Row,
  SizedBox,
  Text,
  TextStyle,
  EdgeInsets,
  Padding,
  MainAxisSize,
  Opacity,
  GestureDetector,
  type Widget,
} from "flitter-core";
import { CheckBox } from "./checkbox";
import type { ToastBaseConfig } from "./config";

export function toastLegend(
  { name, index }: { name: string; index: number },
  context: {
    config: ToastBaseConfig;
    isSeriesVisible(legend: string): boolean;
    toggleSeries(legend: string): void;
  },
): Widget {
  const { colors, font } = context.config;
  const color = colors[index % colors.length];
  const visible = context.isSeriesVisible(name);

  const content = Padding({
    padding: EdgeInsets.symmetric({ horizontal: 8 }),
    child: Row({
      mainAxisSize: MainAxisSize.min,
      children: [
        CheckBox({ checked: visible, color, size: 14 }),
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

  return GestureDetector({
    onClick: () => context.toggleSeries(name),
    child: visible
      ? content
      : Opacity({
          opacity: 0.4,
          child: content,
        }),
  });
}
