import type { FunnelChartCustom } from "../types";
import {
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  MainAxisAlignment,
  Row,
} from "flitter-core";

export function Layout(
  ...[{ title, legends, funnel }]: Parameters<FunnelChartCustom["layout"]>
) {
  return Container({
    padding: EdgeInsets.all(20),
    child: Column({
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Row({
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [title],
        }),
        Container({
          margin: EdgeInsets.symmetric({ vertical: 10 }),
          child: Row({
            mainAxisAlignment: MainAxisAlignment.center,
            children: legends,
          }),
        }),
        funnel,
      ],
    }),
  });
}
