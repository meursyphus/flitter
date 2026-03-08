import type { SunburstCustom } from "../types";
import {
  Container,
  EdgeInsets,
  MainAxisAlignment,
  Padding,
  Row,
  Text,
  TextStyle,
  SizedBox,
  CrossAxisAlignment,
  type Widget,
} from "flitter-core";
import { HoverTooltip } from "../../_flitter/shared/interaction/hover-tooltip";
import { agTooltipContent, defaultAgCartesianBaseConfig } from "../../ag-base/index";

export function Legend(
  ...[{ items }]: Parameters<SunburstCustom["legend"]>
): Widget {
  return Padding({
    padding: EdgeInsets.only({ top: 10 }),
    child: Row({
      mainAxisAlignment: MainAxisAlignment.center,
      children: items,
    }),
  });
}

export function LegendItem(
  ...[{ label, color }]: Parameters<SunburstCustom["legendItem"]>
): Widget {
  return new HoverTooltip({
    position: "topCenter",
    tooltip: agTooltipContent({
      label,
      items: { legend: "Segment", color, value: 1 },
      config: defaultAgCartesianBaseConfig,
    }),
    renderChild: () =>
      Padding({
        padding: EdgeInsets.symmetric({ horizontal: 6 }),
        child: Row({
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container({
              width: 12,
              height: 12,
              color,
            }),
            SizedBox({ width: 4 }),
            Text(label, {
              style: new TextStyle({ fontSize: 12 }),
            }),
          ],
        }),
      }),
  });
}
