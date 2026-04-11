import RenderObjectElement from "../element/RenderObjectElement";
import type RenderObject from "../renderobject/RenderObject";
import Widget from "./Widget";

class RenderObjectWidget extends Widget {
  children: Widget[];

  constructor({ children = [], key }: { children: Widget[]; key?: any }) {
    super(key);
    this.children = children;
  }

  createElement(): RenderObjectElement {
    return new RenderObjectElement(this);
  }

  createRenderObject(): RenderObject {
    throw new Error("not implemented createRenderObject");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateRenderObject(renderObject: RenderObject) {
    throw new Error("not implemented updatedRenderObject");
  }
}

export default RenderObjectWidget;
