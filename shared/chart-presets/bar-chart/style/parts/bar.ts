import {
  Container,
  EdgeInsets,
  BoxDecoration,
  GestureDetector,
  Opacity,
  type Widget,
} from "flitter-core";
import type { BarChartContext } from "flitter-ui/chart";
import type { AgBarChartConfig } from "../config";

export function agBar(
  { legend, index }: { value: number; label: string; legend: string; index: number },
  context: BarChartContext<AgBarChartConfig>,
): Widget {
  const { colors, bar } = context.config;
  const idx = context.legends.indexOf(legend);
  const color = colors.fills[idx % colors.fills.length];
  const { hoveredBar } = context;

  let opacity = 1;
  if (hoveredBar != null) {
    if (context.isBarHovered(index, legend)) {
      opacity = 1;
    } else if (hoveredBar.legend === legend) {
      opacity = 0.8;
    } else {
      opacity = 0.3;
    }
  }

  const barWidget = Container({
    margin: EdgeInsets.symmetric({ horizontal: bar.gap }),
    decoration: new BoxDecoration({ color }),
  });

  return GestureDetector({
    cursor: "default",
    onMouseEnter: () => context.hoverBar(index, legend),
    child: opacity < 1
      ? Opacity({ opacity, child: barWidget })
      : barWidget,
  });
}
