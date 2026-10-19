import { Text, TextStyle, type Widget } from "flitterjs";

export function Label(
  { name }: { name: string; index: number },
  {
    fontSize = 12,
    color = "black",
    fontFamily,
  }: { fontSize?: number; color?: string; fontFamily?: string } = {},
): Widget {
  return Text(name, {
    style: new TextStyle({ fontSize, color, fontFamily }),
  });
}
