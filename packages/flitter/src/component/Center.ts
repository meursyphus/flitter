import { Alignment } from "../type";
import type Widget from "../widget/Widget";
import Align from "./base/BaseAlign";

export default function Center({
  child,
  widthFactor,
  heightFactor,
}: {
  child?: Widget;
  widthFactor?: number;
  heightFactor?: number;
}) {
  return new Align({
    child,
    widthFactor: widthFactor,
    heightFactor: heightFactor,
    alignment: Alignment.center,
  });
}
