import { Container, type Widget } from "flitter-core";

export function XAxisLine({
  thickness = 1,
  color = "black",
}: { thickness?: number; color?: string } = {}): Widget {
  return Container({
    color,
    height: thickness,
    width: Infinity,
  });
}

