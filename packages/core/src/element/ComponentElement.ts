import type Widget from "../widget/Widget";
import Element from "./Element";

class ComponentElement extends Element {
  child: Element | null = null;

  declare widget: Widget;
  constructor(widget: Widget) {
    super(widget);
    this.widget = widget;
  }

  override unmount(): void {
    super.unmount();
  }

  override mount(newParent?: Element | undefined): void {
    super.mount(newParent);
    this._firstBuild();
  }

  override activate(newParent?: Element): void {
    super.activate(newParent);
    this.child?.activate(this);
  }

  override update(newWidget: Widget): void {
    super.update(newWidget);
    this.rebuild({ force: true });
  }

  initState(): void {
    throw new Error("not implemented initState on component element");
  }

  build(): Widget {
    throw new Error("not implemented build on component element");
  }

  _firstBuild() {
    this.initState();
    this.performRebuild();
  }

  override performRebuild(): void {
    const built = this.build();
    this.child = this.updateChild(this.child, built) ?? null;
  }

  override visitChildren(visitor: (child: Element) => void): void {
    if (this.child != null) {
      visitor(this.child);
    }
  }

  override forgetChild(child: Element): void {
    if (this.child === child) {
      this.child = null;
    }
  }
}

export default ComponentElement;
