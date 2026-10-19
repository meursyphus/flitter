import { Container, type Widget } from "flitterjs";

export function GridXLine({
  thickness = 1,
  color = "black",
}: { thickness?: number; color?: string } = {}): Widget {
  return Container({
    width: Infinity,
    height: thickness,
    color,
  });
}
