import type { RenderObject } from "./RenderObject";
import type { RenderZIndex } from "../component/base/BaseZIndex";
import type { RenderGestureDetector } from "../component/base/BaseGestureDetector";

export interface RenderObjectVisitor {
  visit(renderObject: RenderObject): void;
  visitZIndex(zIndex: RenderZIndex): void;
  visitGestureDetector(gestureDetector: RenderGestureDetector): void;
}
