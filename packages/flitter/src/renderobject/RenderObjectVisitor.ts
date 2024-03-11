import type { RenderZIndex } from "../component/base/BaseZIndex";
import type RenderObject from "./RenderObject";

interface RenderObjectVisitor {
  visitZIndex(renderObject: RenderZIndex);
  visitGeneral(renderObject: RenderObject);
}

export default RenderObjectVisitor;
