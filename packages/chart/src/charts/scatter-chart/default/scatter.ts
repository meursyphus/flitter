import type { ScatterChartCustom } from "../types";
import { Container, BoxDecoration } from "flitter-core";

export function Scatter(
  ...[{  }, { scale }]: Parameters<
    ScatterChartCustom["scatter"]
  >
) {
  const radius = 10

  return Container({
    width: 10,
    height: 10,
    decoration: new BoxDecoration({
      color: "black",
      shape: "circle",
    }),
  });
}
