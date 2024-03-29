import SingleChildRenderObject from "../renderobject/SingleChildRenderObject";
import RenderObjectWidget from "./RenderObjectWidget";
import type Widget from "./Widget";

class SingleChildRenderObjectWidget extends RenderObjectWidget {
  constructor({ child, key }: { child?: Widget; key?: any } = {}) {
    super({ children: [], key });
    this.child = child;
  }

  protected _child?: Widget;
  set child(value: Widget | undefined) {
    this._child = value;
    if (value) {
      this.children = [value];
    } else {
      this.children = [];
    }
  }
  get child(): Widget | undefined {
    return this._child;
  }

  createRenderObject(): SingleChildRenderObject {
    return new SingleChildRenderObject({ isPainter: true });
  }
}

export default SingleChildRenderObjectWidget;
