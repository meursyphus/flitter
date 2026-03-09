import type { SunburstCustom } from "../types";
import {
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  Expanded,
} from "flitter-core";

export function Layout(
  ...[{ title, sunburst }]: Parameters<SunburstCustom["layout"]>
) {
  return Container({
    width: Infinity,
    height: Infinity,
    padding: EdgeInsets.all(20),
    child: Column({
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        title,
        Expanded({ child: sunburst }),
      ],
    }),
  });
}
