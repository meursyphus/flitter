import type Widget from "../widget/Widget";
import Flexible from "./Flexible";

function Expanded({
  flex,
  child,
  key,
}: {
  flex?: number;
  child: Widget;
  key?: any;
}) {
  return Flexible({
    flex,
    child,
    fit: "tight",
    key,
  });
}

export default Expanded;
