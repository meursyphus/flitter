import type { Constraints} from "../type";
import { Alignment, Rect, TextDirection } from "../type";
import type Widget from "../widget/Widget";
import BaseConstraintsTransformBox from "./base/BaseConstraintsTransformBox";
import ClipRect from "./ClipRect";

function ConstraintsTransformBox({
  clipped = false,
  alignment = Alignment.center,
  textDirection = TextDirection.ltr,
  constraintsTransform,
  child,
  key,
}: {
  clipped?: boolean;
  alignment?: Alignment;
  textDirection?: TextDirection;
  child?: Widget;
  constraintsTransform: (constraints: Constraints) => Constraints;
  key?: any;
}) {
  return ClipRect({
    key,
    clipped,
    clipper: (size) =>
      Rect.fromLTWH({
        left: 0,
        top: 0,
        width: size.width,
        height: size.height,
      }),
    child: new BaseConstraintsTransformBox({
      key,
      alignment,
      textDirection,
      constraintsTransform,
      child,
    }),
  });
}

ConstraintsTransformBox.heightUnconstrained =
  BaseConstraintsTransformBox.heightUnconstrained;
ConstraintsTransformBox.maxHeightUnconstrained =
  BaseConstraintsTransformBox.maxHeightUnconstrained;
ConstraintsTransformBox.maxUnconstrained =
  BaseConstraintsTransformBox.maxUnconstrained;
ConstraintsTransformBox.maxWidthUnconstrained =
  BaseConstraintsTransformBox.maxWidthUnconstrained;
ConstraintsTransformBox.unconstrained =
  BaseConstraintsTransformBox.unconstrained;
ConstraintsTransformBox.unmodified = BaseConstraintsTransformBox.unmodified;
ConstraintsTransformBox.widthUnconstrained =
  BaseConstraintsTransformBox.widthUnconstrained;

export default ConstraintsTransformBox;
