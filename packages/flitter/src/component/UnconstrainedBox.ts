import type { TextDirection } from "../type";
import { Alignment } from "../type";
import type Widget from "../widget/Widget";
import ConstraintsTransformBox from "./ConstraintsTransformBox";

function UnconstrainedBox({
  alignment = Alignment.center,
  clipped = false,
  child,
  textDirection,
  constrainedAxis,
  key,
}: {
  child: Widget;
  textDirection?: TextDirection;
  alignment?: Alignment;
  clipped?: boolean;
  constrainedAxis?: "vertical" | "horizontal";
  key?: any;
}) {
  return ConstraintsTransformBox({
    alignment,
    child,
    clipped,
    textDirection,
    key,
    constraintsTransform: (function () {
      if (constrainedAxis == null) {
        return ConstraintsTransformBox.unconstrained;
      }

      switch (constrainedAxis) {
        case "vertical":
          return ConstraintsTransformBox.widthUnconstrained;
        case "horizontal":
          return ConstraintsTransformBox.heightUnconstrained;
      }
    })(),
  });
}

export default UnconstrainedBox;
