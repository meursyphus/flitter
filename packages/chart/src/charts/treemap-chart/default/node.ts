import type { TreemapCustom } from "../types";
import {
  Positioned,
  Container,
  Text,
  TextStyle,
  Column,
  MainAxisAlignment,
  CrossAxisAlignment,
  Padding,
  EdgeInsets,
  BoxDecoration,
  Border,
  type Widget,
} from "flitter-core";

export function Node(
  ...[{ label, value, color, x, y, width, height }]: Parameters<
    TreemapCustom["node"]
  >
): Widget {
  return Positioned({
    left: x,
    top: y,
    width: width,
    height: height,
    child: Container({
        decoration: new BoxDecoration({
          color,
          border: Border.all({ color: "white", width: 2 }),
        }),
        child: Padding({
          padding: EdgeInsets.all(4),
          child: Column({
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(label, {
                style: new TextStyle({
                  fontSize: Math.max(8, Math.min(14, width / 8)),
                  color: "white",
                  fontWeight: "bold",
                }),
              }),
              Text(String(value), {
                style: new TextStyle({
                  fontSize: Math.max(7, Math.min(11, width / 10)),
                  color: "rgba(255,255,255,0.8)",
                }),
              }),
            ],
          }),
        }),
      }),
  });
}
