import type { RenderZIndex } from "../component/base/BaseZIndex";
import type RenderObject from "./RenderObject";

export interface RenderObjectVisitor {
  visitZIndex(renderObject: RenderZIndex): void;
  visitGeneral(renderObject: RenderObject): void;
}
