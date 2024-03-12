import type { Alignment, Matrix4, Offset } from "../type";
import type Widget from "../widget/Widget";
import BaseTransform from "./base/BaseTransform";

function Transform({
  child,
  transform,
  origin,
  alignment,
  key,
}: {
  child?: Widget;
  transform: Matrix4;
  origin?: Offset;
  alignment?: Alignment;
  key?: any;
}) {
  return new BaseTransform({
    child,
    transform,
    alignment,
    origin,
    key,
  });
}

Transform.rotate = BaseTransform.rotate;
Transform.scale = BaseTransform.scale;
Transform.translate = BaseTransform.translate;

export default Transform;
