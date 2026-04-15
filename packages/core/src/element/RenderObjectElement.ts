import type RenderObject from "../renderobject/RenderObject";
import type RenderObjectWidget from "../widget/RenderObjectWidget";
import Widget from "../widget/Widget";
import Element from "./Element";
import { ElementType } from "./ElementType";

class RenderObjectElement extends Element {
  children!: Element[];

  _renderObject!: RenderObject;
  override type: ElementType = ElementType.render;
  createRenderObject() {
    const renderObject = (
      this.widget as RenderObjectWidget
    ).createRenderObject();
    return renderObject;
  }

  override get renderObject(): RenderObject {
    return this._renderObject;
  }

  constructor(widget: RenderObjectWidget) {
    super(widget);
  }

  override unmount(): void {
    super.unmount();
    this.renderObject.dispose();
    this.children.forEach(child => {
      child.unmount();
    });
    this._renderObject.markNeedsParentLayout();
  }

  override mount(newParent?: Element | undefined): void {
    super.mount(newParent);
    this._renderObject = this.createRenderObject();
    this.attachSelfRenderObject();
    this.children = (this.widget as RenderObjectWidget).children.map(
      childWidget => this.inflateWidget(childWidget),
    );
    this._renderObject.markNeedsParentLayout();
  }

  override update(newWidget: Widget): void {
    super.update(newWidget);
    this.rebuild({ force: true });
  }

  updateChildren(newWidgets: Widget[]) {
    const updatedChildIndexes: number[] = [];
    const oldChildren = this.children;
    const newChildren = newWidgets.map(newWidget => {
      const matchedChildIndex = oldChildren.findIndex(
        (oldChild, oldChildIndex) =>
          !updatedChildIndexes.includes(oldChildIndex) &&
          Widget.canUpdate(newWidget, oldChild.widget),
      );

      let matchedChild: Element | null;
      if (matchedChildIndex === -1) {
        matchedChild = null;
      } else {
        matchedChild = oldChildren[matchedChildIndex];
        updatedChildIndexes.push(matchedChildIndex);
      }

      return this.updateChild(matchedChild, newWidget);
    });

    oldChildren.forEach((oldChild, i) => {
      if (updatedChildIndexes.includes(i)) return;
      this.updateChild(oldChild, null);
    });

    this.children = newChildren as Element[];
  }

  performRebuild(): void {
    (this.widget as RenderObjectWidget).updateRenderObject(this._renderObject);
    const newChildWidgets = (this.widget as RenderObjectWidget).children;
    this.updateChildren(newChildWidgets);
  }

  visitChildren(visitor: (child: Element) => void): void {
    this.children.forEach(child => visitor(child));
  }

  override attachRenderObject(): void {
    this.attachSelfRenderObject();
    this._renderObject.markNeedsParentLayout();
    super.attachRenderObject();
  }

  override detachRenderObject(): void {
    super.detachRenderObject();
    this._renderObject.markNeedsParentLayout();
    this._renderObject.renderOwner.disposeRenderObject(this._renderObject);
    this._renderObject.parent = undefined;
  }

  private attachSelfRenderObject() {
    this.ancestorRenderObjectElement = this.findAncestorRenderObjectElement();
    const ancestorRenderObject = this.ancestorRenderObjectElement?.renderObject;
    if (ancestorRenderObject) {
      this.renderObject.parent = ancestorRenderObject;
      this.renderObject.renderOwner = ancestorRenderObject.renderOwner;
    } else {
      this.renderObject.parent = undefined;
    }
    this._renderObject.attach(this);
  }

  forgetChild(child: Element) {
    this.children = this.children.filter(current => current !== child);
  }

  private ancestorRenderObjectElement!: RenderObjectElement | null;

  private findAncestorRenderObjectElement(): RenderObjectElement | null {
    let ancestor: Element | undefined = this.parent;
    while (ancestor != null && ancestor.type !== ElementType.render) {
      ancestor = ancestor.parent;
    }
    return ancestor as RenderObjectElement | null;
  }
}

export default RenderObjectElement;
