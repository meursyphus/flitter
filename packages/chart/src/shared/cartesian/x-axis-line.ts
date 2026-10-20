import { Container, type Widget } from "flitterjs";

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

