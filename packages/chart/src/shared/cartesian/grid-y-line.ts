import { Container, type Widget } from "flitterjs";

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
