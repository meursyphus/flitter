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
  Container,
  BoxDecoration,
  BorderRadius,
  Radius,
  type Widget,
} from "flitter-core";
import type { AgBaseConfig } from "./config";

/**
 * AG Charts legend uses a colored square marker (not checkbox).
 * Click toggles series visibility with dimmed opacity.
 */
export function agLegend(
  { name, index }: { name: string; index: number },
  context: {
    config: AgBaseConfig;
    isSeriesVisible(legend: string): boolean;
    toggleSeries(legend: string): void;
  },
): Widget {
  const { colors, font } = context.config;
  const color = colors.fills[index % colors.fills.length];
  const visible = context.isSeriesVisible(name);

  const content = Padding({
    padding: EdgeInsets.symmetric({ horizontal: 8, vertical: 4 }),
    child: Row({
      mainAxisSize: MainAxisSize.min,
      children: [
        Container({
          width: 14,
          height: 14,
          decoration: new BoxDecoration({
            color,
            borderRadius: BorderRadius.all(Radius.circular(2)),
          }),
        }),
        SizedBox({ width: 8 }),
        Text(name, {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: font.size,
            color: "#585858",
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
