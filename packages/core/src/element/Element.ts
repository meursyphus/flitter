import type RenderObject from "../renderobject/RenderObject";
import type { BuildOwner, Scheduler, GlobalKey } from "../framework";
import Widget from "../widget/Widget";
import { ElementType } from "./ElementType";
import { NotImplementedError } from "../exception";

export enum ElementLifecycle {
  initial = "initial",
  active = "active",
  inactive = "inactive",
  defunct = "defunct",
}

class Element {
  scheduler!: Scheduler;
  buildOwner!: BuildOwner;
  widget: Widget;
  parent?: Element;
  dirty = true;
  depth = 0;
  protected mounted = false;
  protected lifecycleState: ElementLifecycle = ElementLifecycle.initial;
  constructor(widget: Widget) {
    this.widget = widget;
  }
  type: ElementType = ElementType.none;

  get isActive() {
    return this.lifecycleState === ElementLifecycle.active;
  }

  get isInactive() {
    return this.lifecycleState === ElementLifecycle.inactive;
  }

  get isDefunct() {
    return this.lifecycleState === ElementLifecycle.defunct;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitChildren(visitor: (child: Element) => void) {
    throw new NotImplementedError("visitChildren");
  }

  get renderObject(): RenderObject {
    let result: RenderObject | null = null;

    this.visitChildren(child => {
      if (result == null) {
        result = child.renderObject;
      }
    });

    if (result == null) throw new Error("can not find render object");
    return result;
  }

  //There are 5 case
  // 1. child is not null, but widget is null
  // in this case, child must be unmounted
  // 2. child is null, widget is null
  // nothing happened
  // 3. child is null, widget is not null
  // newWidget would be inflated,
  // 4. child is not null, widget is not null, and widget can be update
  // in this case, just update widget configuration
  // 5. it is similar to 4 but widget can not be update,
  // in this case, child must be deactivated and newWidget would be inflated
  updateChild(
    child?: Element | null,
    newWidget?: Widget | null,
  ): Element | null | undefined {
    if (child != null && newWidget == null) {
      this.deactivateChild(child);
      return null;
    } else if (child == null && newWidget == null) {
      //nothing happen
    } else if (child == null && newWidget != null) {
      return this.inflateWidget(newWidget);
    } else if (
      child != null &&
      newWidget != null &&
      Widget.canUpdate(child.widget, newWidget)
    ) {
      child.update(newWidget);
      return child;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.deactivateChild(child!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.inflateWidget(newWidget!);
    }
  }

  deactivate() {
    this.lifecycleState = ElementLifecycle.inactive;
    this.mounted = false;
  }

  activate(newParent?: Element) {
    this.lifecycleState = ElementLifecycle.active;
    this.mounted = true;
    if (newParent) {
      this.buildOwner = newParent.buildOwner;
      this.depth = newParent.depth + 1;
      this.scheduler = newParent.scheduler;
    }
    this.parent = newParent;
  }

  unmount() {
    if ((this.widget.key as GlobalKey)?.isGlobalKey) {
      this.buildOwner.unregisterGlobalKey(this.widget.key, this);
    }

    this.lifecycleState = ElementLifecycle.defunct;
    this.mounted = false;
    this.parent = undefined;
  }

  mount(newParent?: Element) {
    this.lifecycleState = ElementLifecycle.active;
    this.mounted = true;
    if (newParent) {
      this.buildOwner = newParent.buildOwner;
      this.depth = newParent.depth + 1;
      this.scheduler = newParent.scheduler;
    }
    this.parent = newParent;

    if ((this.widget.key as GlobalKey)?.isGlobalKey) {
      this.buildOwner.registerGlobalKey(this.widget.key, this);
    }
  }

  update(newWidget: Widget) {
    this.widget = newWidget;
  }

  inflateWidget(childWidget: Widget): Element {
    const key = childWidget.key as GlobalKey | undefined;
    if (key?.isGlobalKey) {
      const reclaimedChild = this.retakeInactiveElement(key, childWidget);
      if (reclaimedChild != null) {
        reclaimedChild.activate(this);
        reclaimedChild.update(childWidget);
        return reclaimedChild;
      }
    }

    const newChild = childWidget.createElement();
    newChild.mount(this);
    return newChild;
  }

  unmountRecursively() {
    this.visitChildren(child => {
      child.unmountRecursively();
    });
    this.unmount();
  }

  deactivateChild(child: Element) {
    if (child.parent !== this && !child.isInactive) return;
    child.detachRenderObject();
    child.parent = undefined;
    this.buildOwner.addToInactiveElements(child);
  }

  detachRenderObject() {
    this.visitChildren(child => {
      child.detachRenderObject();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  attachRenderObject() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  forgetChild(_child: Element) {}

  rebuild({ force = false }: { force?: boolean } = {}) {
    if (!this.isActive) return;
    if (!this.dirty && !force) return;
    this.dirty = false;
    this.performRebuild();
  }

  protected performRebuild() {
    throw new Error("not implemented performRebuild");
  }

  markNeedsBuild() {
    if (!this.isActive) return;
    this.dirty = true;
    this.buildOwner.scheduleFor(this);
  }

  private retakeInactiveElement(
    key: GlobalKey,
    newWidget: Widget,
  ): Element | null {
    const element = this.buildOwner.findByGlobalKey(key);
    if (element == null) return null;
    if (!Widget.canUpdate(element.widget, newWidget)) return null;
    if (element.isDefunct) return null;

    const parent = element.parent;
    if (parent != null) {
      parent.forgetChild(element);
      parent.deactivateChild(element);
    }

    this.buildOwner.removeFromInactiveElements(element);
    return element;
  }
}

export default Element;
