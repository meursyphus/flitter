import { Text, TextStyle, type Widget } from "flitter-core";
import type { ToastBaseConfig } from "./cartesian/config";

export function toastTitle(
  _args: undefined,
  context: { config: ToastBaseConfig },
): Widget {
  const { title, font } = context.config;
  return Text(title.text, {
    style: new TextStyle({
      fontFamily: title.fontFamily ?? font.family,
      fontSize: title.fontSize,
      fontWeight: title.fontWeight,
      color: title.color,
    }),
  });
}
