import { Text, TextStyle, type Widget } from "flitter-ui";
import type { ToastBaseConfig } from "./cartesian/config";

type ToastTitleConfig = Pick<ToastBaseConfig, "font" | "title">;

export function toastTitle<TConfig extends ToastTitleConfig>(
  _args: undefined,
  context: { config: TConfig },
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
