import { Text, TextStyle, type Widget } from "flitter-core";

export function toastAxisLabel({
  name,
  fontFamily,
  fontSize,
  color,
}: {
  name: string;
  fontFamily: string;
  fontSize: number;
  color: string;
}): Widget {
  return Text(name, {
    style: new TextStyle({ fontFamily, fontSize, color }),
  });
}
