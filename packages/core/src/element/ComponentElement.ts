import type Widget from "../widget/Widget";
import Element from "./Element";

class ComponentElement extends Element {
  child?: Element;

  declare widget: Widget;
  constructor(widget: Widget) {
    super(widget);
    this.widget = widget;
  }

  override unmount(): void {
    super.unmount();
    this.child?.unmount();
  }

  override mount(newParent?: Element | undefined): void {
    super.mount(newParent);
    this._firstBuild();
  }

  override update(newWidget: Widget): void {
    super.update(newWidget);
    this.rebuild({ force: true });
  }

  override activate(newParent?: Element): void {
    super.activate(newParent);
    this.child?.activate(this);
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

  protected beforeBuild() {
    this.unsubscribeFromInheritedWidgets();
  }

  override performRebuild(): void {
    this.beforeBuild();
    const built = this.build();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.child = this.updateChild(this.child, built) ?? undefined;
  }

  override visitChildren(visitor: (child: Element) => void): void {
    if (this.child) {
      visitor(this.child);
    }
  }

  forgetChild(child: Element) {
    if (this.child === child) {
      this.child = undefined;
    }
  }
}

export default ComponentElement;
