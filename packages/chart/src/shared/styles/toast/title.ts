import { Text, TextStyle, type Widget } from "flitter-core";
import type { ToastBaseConfig } from "./config";

export function toastTitle(
  { name }: { name: string },
  context: { config: ToastBaseConfig },
): Widget {
  const { title, font } = context.config;
  return Text(name, {
    style: new TextStyle({
      fontFamily: title.fontFamily ?? font.family,
      fontSize: title.fontSize,
      fontWeight: title.fontWeight,
      color: title.color,
    }),
  });
}
