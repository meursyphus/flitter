import type { SunburstCustom } from "../types";
import {
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  MainAxisAlignment,
  Row,
} from "flitter-core";

export function Layout(
  ...[{ title, sunburst, legend }]: Parameters<SunburstCustom["layout"]>
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
        sunburst,
        legend,
      ],
    }),
  });
}
