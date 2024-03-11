import type Widget from "../widget/Widget";
import Flex from "./Flex";
import type {
  MainAxisAlignment,
  CrossAxisAlignment,
  VerticalDirection,
  MainAxisSize} from "../type";
import {
  Axis,
} from "../type";

export default function Column({
  children,
  mainAxisAlignment,
  crossAxisAlignment,
  verticalDirection,
  mainAxisSize,
  key,
}: {
  children: Widget[];
  mainAxisAlignment?: MainAxisAlignment;
  crossAxisAlignment?: CrossAxisAlignment;
  verticalDirection?: VerticalDirection;
  mainAxisSize?: MainAxisSize;
  key?: any;
}) {
  return Flex({
    key,
    children,
    direction: Axis.vertical,
    mainAxisAlignment,
    crossAxisAlignment,
    verticalDirection,
    mainAxisSize,
  });
}
