import type RenderObject from "../renderobject/RenderObject";
import type RenderObjectWidget from "../widget/RenderObjectWidget";
import Widget from "../widget/Widget";
import Element from "./Element";
import { ElementType } from "./ElementType";

class RenderObjectElement extends Element {
  children: Element[] = [];

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

  override activate(newParent?: Element): void {
    super.activate(newParent);
    this.attachSelfRenderObject();
    this.children.forEach(child => {
      child.activate(this);
    });
    this._renderObject.markNeedsParentLayout();
  }

  override update(newWidget: Widget): void {
    super.update(newWidget);
    this.rebuild({ force: true });
  }

  updateChildren(newWidgets: Widget[]) {
    const oldChildren = this.children;
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
      if (oldChild.widget.key != null) {
        oldKeyedChildren.set(oldChild.widget.key, oldChild);
      } else {
        oldUnkeyedChildren.push(oldChild);
      }
    }

    let oldUnkeyedIndex = 0;
    while (newTop <= newBottom) {
      const newWidget = newWidgets[newTop];
      let matchedChild: Element | null = null;

      if (newWidget.key != null) {
        const keyedChild = oldKeyedChildren.get(newWidget.key) ?? null;
        if (
          keyedChild != null &&
          Widget.canUpdate(keyedChild.widget, newWidget)
        ) {
          matchedChild = keyedChild;
          oldKeyedChildren.delete(newWidget.key);
        }
      } else {
        while (oldUnkeyedIndex < oldUnkeyedChildren.length) {
          const candidate = oldUnkeyedChildren[oldUnkeyedIndex++];
          if (candidate.parent !== this) continue;
          if (Widget.canUpdate(candidate.widget, newWidget)) {
            matchedChild = candidate;
            break;
          }
          this.deactivateChild(candidate);
        }
      }

      newChildren[newTop] = this.updateChild(matchedChild, newWidget)!;
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
    this._renderObject.detach();
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
    const index = this.children.indexOf(child);
    if (index === -1) return;
    this.children.splice(index, 1);
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
