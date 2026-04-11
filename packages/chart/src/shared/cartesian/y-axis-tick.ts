import type { CartesianCustom } from "./types";
import { Container, type Widget } from "flitter-core";

export function YAxisTick(
  _: Parameters<CartesianCustom["yAxisTick"]>[0],
  {
    size = 4,
    thickness = 1,
    color = "black",
  }: { size?: number; thickness?: number; color?: string } = {},
): Widget {
  return Container({
    width: size,
    height: thickness,
    color,
  });
}
