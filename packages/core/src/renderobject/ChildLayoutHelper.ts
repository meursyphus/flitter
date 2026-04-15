import type { Constraints, Size } from "../type";
import type RenderObject from "./RenderObject";

type LayoutChild = (child: RenderObject, constraints: Constraints) => Size;

export const ChildLayoutHelper: {
  dryLayoutChild: LayoutChild;
  layoutChild: LayoutChild;
} = {
  dryLayoutChild(child, constraints) {
    return child.getDryLayout(constraints);
  },
  layoutChild(child, constraints) {
    child.layout(constraints, { parentUsesSize: true });
    return child.size;
  },
};

export default ChildLayoutHelper;
