import type Element from "../../element/Element";
import RenderObjectElement from "../../element/RenderObjectElement";
import { SingleChildRenderObject } from "../../renderobject/SingleChildRenderObject";
import type { Constraints } from "../../type";
import { Size } from "../../type";
import type { BuildContext } from "../../widget";
import RenderObjectWidget from "../../widget/RenderObjectWidget";
import type Widget from "../../widget/Widget";

class BaseLayoutBuilder extends RenderObjectWidget {
  builder: (context: BuildContext, constraints: Constraints) => Widget;

  constructor({
    builder,
    key,
  }: {
    builder: (context: BuildContext, constraints: Constraints) => Widget;
    key?: any;
  }) {
    super({ children: [], key });
    this.builder = builder;
  }

  override createElement(): LayoutBuilderElement {
    return new LayoutBuilderElement(this);
  }

  override createRenderObject(): RenderLayoutBuilder {
    return new RenderLayoutBuilder();
  }

  override updateRenderObject(_renderObject: RenderLayoutBuilder): void {
    // No render properties to update
  }
}

class LayoutBuilderElement extends RenderObjectElement {
  private _child: Element | null = null;

  constructor(widget: BaseLayoutBuilder) {
    super(widget);
  }

  /**
   * Called by RenderLayoutBuilder during performLayout.
   * Builds the child widget using the builder callback with current constraints.
   */
  layoutCallback(constraints: Constraints): void {
    const widget = this.widget as BaseLayoutBuilder;
    const built = widget.builder(this, constraints);
    this._child = this.updateChild(this._child, built) as Element | null;
    if (this._child) {
      this.children = [this._child];
    } else {
      this.children = [];
    }
  }

  override performRebuild(): void {
    // Do NOT call super.performRebuild() — we don't want it to
    // updateChildren from widget.children (which is always empty).
    // Instead, just mark the render object for layout.
    // The next layout pass will call layoutCallback with constraints.
    (this._renderObject as RenderLayoutBuilder).markLayoutNeedsRebuild();
  }

  override visitChildren(visitor: (child: Element) => void): void {
    if (this._child != null) {
      visitor(this._child);
    }
  }

  override unmount(): void {
    this._child?.unmount();
    this._renderObject.dispose();
    this.parent = undefined;
    this._renderObject.markNeedsParentLayout();
  }
}

class RenderLayoutBuilder extends SingleChildRenderObject {
  constructor() {
    super({ isPainter: false });
  }

  /**
   * Public wrapper so the element can schedule a relayout.
   */
  markLayoutNeedsRebuild(): void {
    this.markNeedsLayout();
  }

  protected override preformLayout(): void {
    // Build (or rebuild) the child widget with current constraints
    (this.ownerElement as LayoutBuilderElement).layoutCallback(
      this.constraints,
    );

    // Now lay out the child
    if (this.child != null) {
      this.child.layout(this.constraints);
      this.size = this.constraints.constrain(this.child.size);
    } else {
      this.size = this.constraints.constrain(Size.zero);
    }
  }
}

export default BaseLayoutBuilder;
