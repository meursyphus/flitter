import type { CartesianCustom } from "./types";
import { Container, type Widget } from "flitter-core";

export function XAxisTick(
  _: Parameters<CartesianCustom["xAxisTick"]>[0],
  {
    thickness = 1,
    size = 4,
    color = "black",
  }: { thickness?: number; size?: number; color?: string } = {},
): Widget {
  return Container({
    width: thickness,
    height: size,
    color,
  });
}
