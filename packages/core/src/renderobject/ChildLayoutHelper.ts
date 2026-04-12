import type { Constraints, Size } from "../type";
import type RenderObject from "./RenderObject";

export type ChildLayouter = (
  child: RenderObject,
  constraints: Constraints,
) => Size;

const ChildLayoutHelper = {
  dryLayoutChild(child: RenderObject, constraints: Constraints): Size {
    return child.getDryLayout(constraints);
  },

  layoutChild(child: RenderObject, constraints: Constraints): Size {
    child.layout(constraints, { parentUsesSize: true });
    return child.size;
  },
};

export default ChildLayoutHelper;
