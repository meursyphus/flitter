import SizedBox from "./SizedBox";
import type Widget from "../widget/Widget";
import BaseDockLayout from "./base/BaseDockLayout";

export default function DockLayout({
  left,
  bottom,
  corner,
  fill,
  key,
}: {
  left?: Widget;
  bottom?: Widget;
  corner?: Widget;
  fill: Widget;
  key?: any;
}): BaseDockLayout {
  const empty = SizedBox.shrink();
  return new BaseDockLayout({
    children: [left ?? empty, bottom ?? empty, corner ?? empty, fill],
    key,
  });
}
