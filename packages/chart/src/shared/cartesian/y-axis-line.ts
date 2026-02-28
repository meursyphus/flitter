import { Container, type Widget } from "flitter-core";

export function YAxisLine({
  thickness = 1,
  color = "black",
}: { thickness?: number; color?: string } = {}): Widget {
  return Container({
    color,
    width: thickness,
    height: Infinity,
  });
}
