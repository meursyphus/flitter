import type RenderObject from "../renderobject/RenderObject";
import type RenderObjectWidget from "../widget/RenderObjectWidget";
import Widget from "../widget/Widget";
import Element from "./Element";
import { ElementType } from "./ElementType";

class RenderObjectElement extends Element {
  children: Element[] = [];

  _renderObject!: RenderObject;
  override type: ElementType = ElementType.render;

  private ancestorRenderObjectElement: RenderObjectElement | null = null;

  constructor(widget: RenderObjectWidget) {
    super(widget);
  }

  createRenderObject() {
    return (this.widget as RenderObjectWidget).createRenderObject();
  }

  override get renderObject(): RenderObject {
    return this._renderObject;
  }

  override mount(newParent?: Element | undefined): void {
    super.mount(newParent);
    this._renderObject = this.createRenderObject();
    this.attachOwnRenderObject();
    this.children = (this.widget as RenderObjectWidget).children.map(
      childWidget => this.inflateWidget(childWidget),
    );
    this._renderObject.markNeedsParentLayout();
  }

  override activate(newParent?: Element): void {
    super.activate(newParent);
    this.attachOwnRenderObject();
    this.children.forEach(child => {
      child.activate(this);
    });
    this._renderObject.markNeedsParentLayout();
  }

  override unmount(): void {
    this.renderObject.dispose();
    this._renderObject.markNeedsParentLayout();
    super.unmount();
  }

  override update(newWidget: Widget): void {
    super.update(newWidget);
    this.rebuild({ force: true });
  }

  override detachRenderObject(): void {
    this._renderObject.markNeedsParentLayout();
    this.children.forEach(child => {
      child.detachRenderObject();
    });
    this._renderObject.detach();
  }

  override attachRenderObject(): void {
    this.attachOwnRenderObject();
  }

  updateChildren(newWidgets: Widget[]) {
    const oldChildren = this.children.filter(child => child.parent === this);
    const newChildren: Element[] = new Array(newWidgets.length);

    let oldTop = 0;
    let newTop = 0;
    let oldBottom = oldChildren.length - 1;
    let newBottom = newWidgets.length - 1;

    while (oldTop <= oldBottom && newTop <= newBottom) {
      const oldChild = oldChildren[oldTop];
      const newWidget = newWidgets[newTop];
      if (!Widget.canUpdate(oldChild.widget, newWidget)) break;
      newChildren[newTop] = this.updateChild(oldChild, newWidget)!;
      oldTop++;
      newTop++;
    }

    while (oldTop <= oldBottom && newTop <= newBottom) {
      const oldChild = oldChildren[oldBottom];
      const newWidget = newWidgets[newBottom];
      if (!Widget.canUpdate(oldChild.widget, newWidget)) break;
      newChildren[newBottom] = this.updateChild(oldChild, newWidget)!;
      oldBottom--;
      newBottom--;
    }

    const oldKeyedChildren = new Map<any, Element>();
    const oldUnkeyedChildren: Element[] = [];

    for (let i = oldTop; i <= oldBottom; i++) {
      const oldChild = oldChildren[i];
      if (oldChild.parent !== this) continue;
      if (oldChild.widget.key != null) {
        oldKeyedChildren.set(oldChild.widget.key, oldChild);
      } else {
        oldUnkeyedChildren.push(oldChild);
      }
    }

    let oldUnkeyedIndex = 0;
    while (newTop <= newBottom) {
      const newWidget = newWidgets[newTop];
      let oldChild: Element | null = null;

      if (newWidget.key != null) {
        const matchedChild = oldKeyedChildren.get(newWidget.key) ?? null;
        if (
          matchedChild != null &&
          Widget.canUpdate(matchedChild.widget, newWidget)
        ) {
          oldChild = matchedChild;
          oldKeyedChildren.delete(newWidget.key);
        }
      } else {
        while (oldUnkeyedIndex < oldUnkeyedChildren.length) {
          const matchedChild = oldUnkeyedChildren[oldUnkeyedIndex++];
          if (matchedChild.parent !== this) continue;
          if (Widget.canUpdate(matchedChild.widget, newWidget)) {
            oldChild = matchedChild;
            break;
          }
          this.deactivateChild(matchedChild);
        }
      }

      newChildren[newTop] = this.updateChild(oldChild, newWidget)!;
      newTop++;
    }

    while (oldUnkeyedIndex < oldUnkeyedChildren.length) {
      const oldChild = oldUnkeyedChildren[oldUnkeyedIndex++];
      if (oldChild.parent !== this) continue;
      this.deactivateChild(oldChild);
    }

    for (const oldChild of oldKeyedChildren.values()) {
      if (oldChild.parent !== this) continue;
      this.deactivateChild(oldChild);
    }

    this.children = newChildren;
  }

  override performRebuild(): void {
    (this.widget as RenderObjectWidget).updateRenderObject(this._renderObject);
    const newChildWidgets = (this.widget as RenderObjectWidget).children;
    this.updateChildren(newChildWidgets);
  }

  override visitChildren(visitor: (child: Element) => void): void {
    this.children.forEach(child => visitor(child));
  }

  override forgetChild(child: Element): void {
    const index = this.children.indexOf(child);
    if (index === -1) return;
    this.children.splice(index, 1);
  }

  private attachOwnRenderObject() {
    this.ancestorRenderObjectElement = this.findAncestorRenderObjectElement();
    const ancestorRenderObject = this.ancestorRenderObjectElement?.renderObject;
    this._renderObject.parent = ancestorRenderObject;
    if (ancestorRenderObject != null) {
      this._renderObject.renderOwner = ancestorRenderObject.renderOwner;
    }
    this._renderObject.attach(this);
  }

  private findAncestorRenderObjectElement(): RenderObjectElement | null {
    let ancestor: Element | undefined = this.parent;
    while (ancestor != null && ancestor.type !== ElementType.render) {
      ancestor = ancestor.parent;
    }
    return ancestor as RenderObjectElement | null;
  }
}

export default RenderObjectElement;
