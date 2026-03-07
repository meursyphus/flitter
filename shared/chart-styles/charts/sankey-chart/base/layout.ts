import type { SankeyChartCustom } from "../types";
import {
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
} from "flitter-core";

export function Layout(
  ...[{ title, sankey }, config]: Parameters<SankeyChartCustom["layout"]>
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
      children: [title, sankey],
    }),
  });
}
