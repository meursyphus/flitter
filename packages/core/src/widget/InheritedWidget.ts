import type Element from "../element/Element";
import Widget from "./Widget";

abstract class InheritedWidget extends Widget {
  child: Widget;

  constructor({ child, key }: { child: Widget; key?: any }) {
    super(key);
    this.child = child;
  }

  abstract createElement(): Element;

  updateShouldNotify(_oldWidget: InheritedWidget): boolean {
    return true;
  }
}

export default InheritedWidget;
