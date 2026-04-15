import type Widget from "../widget/Widget";
import type Element from "./Element";
import ComponentElement from "./ComponentElement";
import type StatefulWidget from "../widget/StatefulWidget";
import type { BuildContext } from "./index";

export class StatefulElement extends ComponentElement {
  state: State<StatefulWidget>;
  private didChangeDependenciesFlag = false;

  constructor(widget: StatefulWidget) {
    super(widget);
    this.state = widget.createState();
    this.state.widget = widget;
    this.state.element = this;
  }

  initState(): void {
    this.state.initState(this);
    this.state.didChangeDependencies();
  }
  build(): Widget {
    return this.state.build(this);
  }

  unmount(): void {
    super.unmount();
    this.state.dispose();
  }

  update(newWidget: StatefulWidget): void {
    const oldWidget = this.state.widget;
    this.state.widget = newWidget;
    this.state.didUpdateWidget(oldWidget);
    super.update(newWidget);
  }

  protected override beforeBuild(): void {
    this.unsubscribeFromInheritedWidgets();
    if (this.didChangeDependenciesFlag) {
      this.state.didChangeDependencies();
      this.didChangeDependenciesFlag = false;
    }
  }

  override activate(newParent?: Element): void {
    super.activate(newParent);
    this.state.activate();
    this.markNeedsBuild();
  }

  override deactivate(): void {
    this.state.deactivate();
    super.deactivate();
  }

  override didChangeDependencies(): void {
    super.didChangeDependencies();
    this.didChangeDependenciesFlag = true;
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
  dispose() {}
  didUpdateWidget(_oldWidget: T) {}
  didChangeDependencies() {}
  activate() {}
  deactivate() {}
}
