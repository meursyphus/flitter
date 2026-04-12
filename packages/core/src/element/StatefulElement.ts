import type Widget from "../widget/Widget";
import ComponentElement from "./ComponentElement";
import type StatefulWidget from "../widget/StatefulWidget";
import type { BuildContext } from "./index";
import type Element from "./Element";

export class StatefulElement extends ComponentElement {
  state: State<StatefulWidget>;

  constructor(widget: StatefulWidget) {
    super(widget);
    this.state = widget.createState();
    this.state.widget = widget;
    this.state.element = this;
  }

  initState(): void {
    return this.state.initState(this);
  }
  build(): Widget {
    return this.state.build(this);
  }

  override deactivate(): void {
    this.state.deactivate();
    super.deactivate();
  }

  override activate(newParent?: Element): void {
    super.activate(newParent);
    this.state.activate();
  }

  override unmount(): void {
    this.state.dispose();
    super.unmount();
  }

  update(newWidget: StatefulWidget): void {
    const oldWidget = this.state.widget;
    this.state.widget = newWidget;
    this.state.didUpdateWidget(oldWidget);
    super.update(newWidget);
  }
}

export class State<T extends StatefulWidget> {
  widget!: T;
  element!: StatefulElement;
  initState(_context: BuildContext) {}
  build(_context: BuildContext): Widget {
    throw Error("not implemented state build");
  }
  setState(callback?: () => any) {
    callback?.();
    this.element.markNeedsBuild();
  }
  deactivate() {}
  activate() {}
  dispose() {}
  didUpdateWidget(_oldWidget: T) {}
}
