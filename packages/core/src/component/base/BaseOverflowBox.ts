import RenderAligningShiftedBox from "../../renderobject/RenderAligningShiftedBox";
import { Alignment, Constraints, TextDirection } from "../../type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

class BaseOverflowBox extends SingleChildRenderObjectWidget {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  alignment: Alignment;
  constructor({
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    alignment = Alignment.center,
    child,
    key,
  }: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    child?: Widget;
    alignment?: Alignment;
    key?: any;
  }) {
    super({ child, key });
    this.maxHeight = maxHeight;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
    this.minWidth = minWidth;
    this.alignment = alignment;
  }

  override createRenderObject(): RenderOverflowBox {
    return new RenderOverflowBox({
      alignment: this.alignment,
      maxHeight: this.maxHeight,
      maxWidth: this.maxWidth,
      minHeight: this.minHeight,
      minWidth: this.minWidth,
    });
  }

  updateRenderObject(renderObject: RenderOverflowBox): void {
    renderObject.maxHeight = this.maxHeight;
    renderObject.maxWidth = this.maxWidth;
    renderObject.minHeight = this.minHeight;
    renderObject.minWidth = this.minWidth;
  }
}

class RenderOverflowBox extends RenderAligningShiftedBox {
  _minWidth?: number;
  _maxWidth?: number;
  _minHeight?: number;
  _maxHeight?: number;
  get minWidth(): number | undefined {
    return this._minWidth;
  }

  set minWidth(newMinWidth: number | undefined) {
    if (this._minWidth === newMinWidth) return; // early return
    this._minWidth = newMinWidth;
    this.markNeedsLayout();
  }

  get maxWidth(): number | undefined {
    return this._maxWidth;
  }

  set maxWidth(newMaxWidth: number | undefined) {
    if (this._maxWidth === newMaxWidth) return; // early return
    this._maxWidth = newMaxWidth;
    this.markNeedsLayout();
  }

  get minHeight(): number | undefined {
    return this._minHeight;
  }

  set minHeight(newMinHeight: number | undefined) {
    if (this._minHeight === newMinHeight) return; // early return
    this._minHeight = newMinHeight;
    this.markNeedsLayout();
  }

  get maxHeight(): number | undefined {
    return this._maxHeight;
  }

  set maxHeight(newMaxHeight: number | undefined) {
    if (this._maxHeight === newMaxHeight) return; // early return
    this._maxHeight = newMaxHeight;
    this.markNeedsLayout();
  }
  constructor({
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    alignment = Alignment.center,
  }: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    alignment?: Alignment;
  }) {
    super({ alignment, textDirection: TextDirection.ltr });
    this._maxHeight = maxHeight;
    this._maxWidth = maxWidth;
    this._minHeight = minHeight;
    this._minWidth = minWidth;
  }

  override preformLayout(): void {
    this.size = this.constraints.biggest;

    if (this.child != null) {
      this.child.layout(this.getInnerConstraints(this.constraints));
      this.alignChild();
    }
  }

  private getInnerConstraints(constraints: Constraints): Constraints {
    return new Constraints({
      minHeight: this.minHeight ?? constraints.minHeight,
      maxHeight: this.maxHeight ?? constraints.maxHeight,
      minWidth: this.minWidth ?? constraints.minWidth,
      maxWidth: this.maxWidth ?? constraints.maxWidth,
    });
  }
}

export default BaseOverflowBox;
