import type RenderObject from "../renderobject/RenderObject";
import type { BuildOwner, Scheduler, GlobalKey } from "../framework";
import Widget from "../widget/Widget";
import { ElementType } from "./ElementType";
import { NotImplementedError } from "../exception";

export enum ElementLifecycleState {
  active = "active",
  inactive = "inactive",
  defunct = "defunct",
}

export interface InheritedDependencySource {
  registerDependent(element: Element): void;
  unregisterDependent(element: Element): void;
}

class Element {
  scheduler!: Scheduler;
  buildOwner!: BuildOwner;
  widget: Widget;
  parent?: Element;
  dirty = true;
  depth = 0;
  protected mounted = false;
  lifecycleState: ElementLifecycleState = ElementLifecycleState.defunct;
  private dependencies = new Set<InheritedDependencySource>();
  private hadDependencies = false;
  constructor(widget: Widget) {
    this.widget = widget;
  }
  type: ElementType = ElementType.none;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitChildren(visitor: (child: Element) => void) {
    throw new NotImplementedError("visitChildren");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forgetChild(_child: Element) {
    //
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
  // in this case, child must be unmounted and newWidget would be inflated
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
    } else if (child != null && newWidget != null && child.widget === newWidget) {
      return child;
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

  unmount() {
    this.unsubscribeFromInheritedWidgets();
    if ((this.widget.key as GlobalKey)?.isGlobalKey) {
      this.buildOwner.unregisterGlobalKey(this.widget.key, this);
    }
    this.mounted = false;
    this.parent = undefined;
    this.lifecycleState = ElementLifecycleState.defunct;
  }

  mount(newParent?: Element) {
    this.mounted = true;
    if (newParent) {
      this.buildOwner = newParent.buildOwner;
      this.depth = newParent.depth + 1;
      this.scheduler = newParent.scheduler;
    }
    this.parent = newParent;
    this.lifecycleState = ElementLifecycleState.active;

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
      const inactiveChild = this.buildOwner.retakeElement(key, childWidget);
      if (inactiveChild != null) {
        inactiveChild.activate(this);
        inactiveChild.update(childWidget);
        return inactiveChild;
      }
    }

    const newChild = childWidget.createElement();
    newChild.mount(this);
    return newChild;
  }

  rebuild({ force = false }: { force?: boolean } = {}) {
    if (!this.mounted) return;
    if (this.lifecycleState !== ElementLifecycleState.active) return;
    if (!this.dirty && !force) return;
    this.dirty = false;
    this.performRebuild();
  }

  protected performRebuild() {
    throw new Error("not implemented performRebuild");
  }

  markNeedsBuild() {
    if (!this.mounted) return;
    if (this.lifecycleState !== ElementLifecycleState.active) return;
    this.dirty = true;
    this.buildOwner.scheduleFor(this);
  }

  activate(newParent?: Element) {
    if (this.lifecycleState !== ElementLifecycleState.inactive) return;
    if (newParent != null) {
      this.buildOwner = newParent.buildOwner;
      this.scheduler = newParent.scheduler;
      this.parent = newParent;
      this.depth = newParent.depth + 1;
    }
    this.lifecycleState = ElementLifecycleState.active;
    this.mounted = true;
    if ((this.widget.key as GlobalKey)?.isGlobalKey) {
      this.buildOwner.registerGlobalKey(this.widget.key, this);
    }
    const hadDependencies = this.hadDependencies;
    this.dependencies.clear();
    this.hadDependencies = false;
    if (this.dirty) {
      this.buildOwner.scheduleFor(this);
    }
    if (hadDependencies) {
      this.didChangeDependencies();
    }
  }

  activateWithParent(newParent: Element) {
    this.activate(newParent);
  }

  deactivate() {
    if (this.lifecycleState !== ElementLifecycleState.active) return;
    this.unsubscribeFromInheritedWidgets({ keepDependencyState: true });
    this.lifecycleState = ElementLifecycleState.inactive;
    this.visitChildren(child => {
      child.deactivate();
    });
  }

  deactivateChild(child: Element) {
    if (child.parent === this) {
      child.parent = undefined;
    }
    child.detachRenderObject();
    this.buildOwner.deactivate(child);
  }

  attachRenderObject() {
    this.visitChildren(child => {
      child.attachRenderObject();
    });
  }

  detachRenderObject() {
    this.visitChildren(child => {
      child.detachRenderObject();
    });
  }

  dependOnInheritedElement<T extends InheritedDependencySource>(
    source: T,
  ): T {
    source.registerDependent(this);
    this.dependencies.add(source);
    return source;
  }

  didChangeDependencies() {
    this.markNeedsBuild();
  }

  get isActive() {
    return this.lifecycleState === ElementLifecycleState.active;
  }

  protected unsubscribeFromInheritedWidgets({
    keepDependencyState = false,
  }: {
    keepDependencyState?: boolean;
  } = {}) {
    if (this.dependencies.size === 0) return;

    for (const dependency of this.dependencies) {
      dependency.unregisterDependent(this);
    }

    if (keepDependencyState) {
      this.hadDependencies = true;
    } else {
      this.hadDependencies = false;
    }

    this.dependencies.clear();
  }
}

export default Element;
