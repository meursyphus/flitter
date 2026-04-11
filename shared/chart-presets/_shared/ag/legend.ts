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
import type { AgCartesianBaseConfig } from "./cartesian/config";

type AgLegendConfig = Pick<AgCartesianBaseConfig, "colors" | "font" | "legend">;

/**
 * AG Charts legend uses a colored marker (square or circle).
 * Visibility is indicated by dimmed opacity.
 * Click handling (toggleSeries) is managed by headless.
 */
export function agLegend<TConfig extends AgLegendConfig>(
  { name, index, isVisible }: { name: string; index: number; isVisible?: boolean },
  context: {
    config: TConfig;
    isSeriesVisible?(legend: string): boolean;
  },
  { markerShape = "rectangle" }: { markerShape?: "rectangle" | "circle" } = {},
): Widget {
  const { colors, font } = context.config;
  const color = colors.fills[index % colors.fills.length];
  const visible = isVisible ?? context.isSeriesVisible?.(name) ?? true;

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
            shape: markerShape,
          }),
        }),
        SizedBox({ width: 8 }),
        Text(name, {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: font.size,
            color: context.config.legend.color,
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
