import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

class Flexible extends SingleChildRenderObjectWidget {
  flex: number;
  fit: "tight" | "loose";
  constructor({
    flex = 1,
    child,
    fit = "loose",
    key,
  }: {
    flex?: number;
    child?: Widget;
    fit?: "tight" | "loose";
    key?: any;
  } = {}) {
    super({ child, key });
    if (flex < 0) throw { message: "flex must not be under zero" };
    this.flex = flex;
    this.fit = fit;
  }
  createRenderObject(): RenderFlexible {
    return new RenderFlexible({ flex: this.flex, fit: this.fit });
  }
  updateRenderObject(renderObject: RenderFlexible): void {
    renderObject.flex = this.flex;
    renderObject.fit = this.fit;
  }
}

export class RenderFlexible extends SingleChildRenderObject {
  _flex: number;
  _fit: "tight" | "loose";

  get flex(): number {
    return this._flex;
  }

  set flex(newFlex: number) {
    if (this._flex === newFlex) return; // early return
    this._flex = newFlex;
    this.markNeedsLayout();
  }

  get fit(): "tight" | "loose" {
    return this._fit;
  }

  set fit(newFit: "tight" | "loose") {
    if (this._fit === newFit) return; // early return
    this._fit = newFit;
    this.markNeedsLayout();
  }
  constructor({ flex, fit }: { flex: number; fit: "tight" | "loose" }) {
    super({ isPainter: false });
    this._flex = flex;
    this._fit = fit;
  }
}

export default Flexible;
