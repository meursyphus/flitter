import { Text, TextStyle, type Widget } from "flitter-core";
import type { AgBaseConfig } from "./config";

export function agTitle(
  { name }: { name: string },
  context: { config: AgBaseConfig },
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
