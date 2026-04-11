import { Column, MainAxisSize, CrossAxisAlignment, SizedBox, Text, TextStyle, type Widget } from "flitter-core";
import type { AgCartesianBaseConfig } from "./cartesian/config";

const titleAlignmentMap = {
  start: CrossAxisAlignment.start,
  center: CrossAxisAlignment.center,
  end: CrossAxisAlignment.end,
} as const;

export function agTitle(
  _args: undefined,
  context: { config: AgCartesianBaseConfig },
): Widget {
  const { title, subtitle, font } = context.config;
  const titleWidget = Text(title.text, {
    style: new TextStyle({
      fontFamily: title.fontFamily ?? font.family,
      fontSize: title.fontSize,
      fontWeight: title.fontWeight,
      color: title.color,
    }),
  });

  if (subtitle.visible && subtitle.text) {
    return Column({
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: titleAlignmentMap[title.alignment],
      children: [
        titleWidget,
        SizedBox({ height: 4 }),
        Text(subtitle.text, {
          style: new TextStyle({
            fontSize: subtitle.fontSize,
            fontFamily: subtitle.fontFamily ?? font.family,
            fontWeight: subtitle.fontWeight,
            color: subtitle.color,
          }),
        }),
      ],
    });
  }
  return titleWidget;
}
