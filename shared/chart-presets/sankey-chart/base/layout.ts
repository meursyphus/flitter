import type { SankeyChartCustom } from "../types";
import {
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  Flexible,
  Stack,
  StackFit,
} from "flitter-ui";

export function Layout(
  ...[{ title, dataView, tooltipArea }]: Parameters<SankeyChartCustom["layout"]>
) {
  return Container({
    padding: EdgeInsets.only({
      left: 20,
      bottom: 20,
      right: 20,
      top: 10,
    }),
    child: Column({
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        title,
        Flexible({
          flex: 1,
          child: Stack({
            fit: StackFit.expand,
            clipped: false,
            children: [dataView, tooltipArea],
          }),
        }),
      ],
    }),
  });
}
