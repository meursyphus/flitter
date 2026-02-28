import { Text, TextStyle, type Widget } from "flitter-core";

export function toastTitle({
  name,
  fontFamily,
  fontSize,
  fontWeight,
  color,
}: {
  name: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  color: string;
}): Widget {
  return Text(name, {
    style: new TextStyle({ fontFamily, fontSize, fontWeight, color }),
  });
}
