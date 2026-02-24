import { ElementType } from "../element/ElementType";
import Element from "../element/Element";
import Widget from "../widget/Widget";

class Provider<ProviderKey, Value> extends Widget {
  providerKey: ProviderKey;
  value: Value;
  child: Widget;
  constructor({
    child,
    providerKey,
    value,
  }: {
    child: Widget;
    providerKey: ProviderKey;
    value: Value;
  }) {
    super();
    this.child = child;
    this.providerKey = providerKey;
    this.value = value;
  }

  static of<V>(key: unknown, context: Element) {
    let parent = context.parent;
    while (parent != null) {
      const current = parent;
      parent = current.parent;
      if (!(current.type === ElementType.provider)) continue;
      if ((current as ProviderElement).providerKey !== key) continue;

      return (current as ProviderElement).value as V;
    }

    throw { message: "can not find requested provider value" };
  }

  override createElement(): ProviderElement {
    return new ProviderElement(this);
  }
}

class ProviderElement extends Element {
  declare widget: Provider<unknown, unknown>;
  child!: Element;
  override readonly type = ElementType.provider;

  get providerKey() {
    return this.widget.providerKey;
  }

  get value() {
    return this.widget.value;
  }

  visitChildren(visitor: (child: Element) => void): void {
    visitor(this.child);
  }

  mount(newParent?: Element | undefined): void {
    super.mount(newParent);
    this.child = this.inflateWidget(this.widget.child);
  }

  override unmount(): void {
    super.unmount();
    this.child.unmount();
  }

  update(newWidget: Widget): void {
    super.update(newWidget);
    this.performRebuild();
  }

  protected override performRebuild(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.child = this.updateChild(this.child, this.child.widget)!;
  }

  constructor(widget: Provider<unknown, unknown>) {
    super(widget);
    this.widget = widget;
  }
}

export type ProviderProps<ProviderKey, Value> = {
  providerKey: ProviderKey;
  value: Value;
  child: Widget;
};

export function ProviderFn<ProviderKey, Value>(
  props: ProviderProps<ProviderKey, Value>,
) {
  return new Provider(props);
}

ProviderFn.of = Provider.of;

export default ProviderFn;
