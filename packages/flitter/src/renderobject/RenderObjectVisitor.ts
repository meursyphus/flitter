import type { RenderObject } from "./RenderObject";
import type { RenderZIndex } from "../component/base/BaseZIndex";

export interface RenderObjectVisitor {
  visit(renderObject: RenderObject): void;
  visitZIndex(zIndex: RenderZIndex): void;
}
