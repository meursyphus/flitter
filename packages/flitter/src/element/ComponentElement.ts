import type Widget from "../widget/Widget";
import Element from "./Element";

class ComponentElement extends Element {
  child!: Element;

  declare widget: Widget;
  constructor(widget: Widget) {
    super(widget);
    this.widget = widget;
  }

  override unmount(): void {
    super.unmount();
    this.child.unmount();
  }

  override mount(newParent?: Element | undefined): void {
    super.mount(newParent);
    this._firstBuild();
  }

  override update(newWidget: Widget): void {
    super.update(newWidget);
    this.rebuild({ force: true });
  }

  initState(): void {
    throw new Error("not implemented initState on compoenent element");
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.child = this.updateChild(this.child, built)!;
  }

  override visitChildren(visitor: (child: Element) => void): void {
    visitor(this.child);
  }
}

export default ComponentElement;
