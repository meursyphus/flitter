import type { CartesianCustom } from "./types";
import { Text, TextStyle, type Widget } from "flitter-core";

export function XAxisLabel({
  name,
}: Parameters<CartesianCustom["xAxisLabel"]>[0]): Widget {
  return Text(name, { style: new TextStyle({ fontSize: 12, color: "black" }) });
}
