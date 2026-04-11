import {
  Container,
  EdgeInsets,
  BoxDecoration,
  Opacity,
  type Widget,
} from "flitter-ui";
import type { BarChartContext } from "flitter-ui/chart";
import type { AgStackedBarChartConfig } from "../config";

export function agBar(
  { legend, index, isHovered }: { value: number; label: string; legend: string; index: number; isHovered: boolean },
  context: BarChartContext<AgStackedBarChartConfig>,
): Widget {
  const { colors, bar } = context.config;
  const idx = context.legends.indexOf(legend);
  const color = colors.fills[idx % colors.fills.length];
  const { hoveredBar } = context;

  let opacity = 1;
  if (hoveredBar != null) {
    if (isHovered) {
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

  return opacity < 1
    ? Opacity({ opacity, child: barWidget })
    : barWidget;
}
