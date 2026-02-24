import type { CartesianCustom } from "./types";
import { EdgeInsets, Padding, Text, TextStyle, type Widget } from "flitter-core";

export function Legend(...[{ name }]: Parameters<CartesianCustom["legend"]>): Widget {
  return Padding({
    padding: EdgeInsets.only({ right: 5 }),
    child: Text(name, {
      style: new TextStyle({
        fontSize: 12,
      }),
    }),
  });
}
