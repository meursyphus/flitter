import { Container, type Widget } from "flitter-core";

export function GridYLine({
  thickness = 1,
  color = "black",
}: { thickness?: number; color?: string } = {}): Widget {
  return Container({
    width: thickness,
    height: Infinity,
    color,
  });
}
