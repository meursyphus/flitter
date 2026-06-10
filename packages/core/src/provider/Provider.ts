import { ElementType } from "../element/ElementType";
import Element from "../element/Element";
import type { InheritedDependencySource } from "../element/Element";
import type Widget from "../widget/Widget";
import InheritedWidget from "../widget/InheritedWidget";

class Provider<ProviderKey, Value> extends InheritedWidget {
  providerKey: ProviderKey;
  value: Value;
  notifyToken?: unknown;
  updateShouldNotifyFn?: (
    oldValue: Value,
    newValue: Value,
    oldWidget: Provider<ProviderKey, Value>,
  ) => boolean;
  constructor({
    child,
    providerKey,
    value,
    key,
    notifyToken,
    updateShouldNotify,
  }: {
    child: Widget;
    providerKey: ProviderKey;
    value: Value;
    key?: any;
    notifyToken?: unknown;
    updateShouldNotify?: (
      oldValue: Value,
      newValue: Value,
      oldWidget: Provider<ProviderKey, Value>,
    ) => boolean;
  }) {
    super({ child, key });
    this.providerKey = providerKey;
    this.value = value;
    this.notifyToken = notifyToken;
    this.updateShouldNotifyFn = updateShouldNotify;
  }

  static of<V>(key: unknown, context: Element) {
    const inherited = context.inheritedProviders?.get(key) as
      | ProviderElement
      | undefined;
    if (inherited != null && inherited.providerKey === key) {
      return context.dependOnInheritedElement(inherited).value as V;
    }

    /*
      Parent-chain walk kept as fallback for contexts whose inheritedProviders
      was never wired (detached/SSR-constructed elements). A map miss also
      falls through so a wiring gap can only cost the walk, never change the
      result.
    */
    let parent = context.parent;
    while (parent != null) {
      const current = parent;
      parent = current.parent;
      if (!(current.type === ElementType.provider)) continue;
      if ((current as ProviderElement).providerKey !== key) continue;

      return context.dependOnInheritedElement(current as ProviderElement)
        .value as V;
    }

    throw new Error("can not find requested provider value");
  }

  override updateShouldNotify(oldWidget: Provider<ProviderKey, Value>): boolean {
    if (this.notifyToken !== undefined || oldWidget.notifyToken !== undefined) {
      return this.notifyToken !== oldWidget.notifyToken;
    }
    if (this.updateShouldNotifyFn) {
      return this.updateShouldNotifyFn(oldWidget.value, this.value, oldWidget);
    }
    return oldWidget.value !== this.value;
  }

  override createElement(): ProviderElement<ProviderKey, Value> {
    return new ProviderElement(this);
  }
}

class ProviderElement<ProviderKey = unknown, Value = unknown>
  extends Element
  implements InheritedDependencySource
{
  declare widget: Provider<ProviderKey, Value>;
  child?: Element;
  private dependents = new Set<Element>();
  override readonly type = ElementType.provider;

  get providerKey() {
    return this.widget.providerKey;
  }

  get value() {
    return this.widget.value;
  }

  visitChildren(visitor: (child: Element) => void): void {
    if (this.child) {
      visitor(this.child);
    }
  }

  mount(newParent?: Element | undefined): void {
    super.mount(newParent);
    this.child = this.inflateWidget(this.widget.child);
  }

  override activate(newParent?: Element): void {
    super.activate(newParent);
    this.child?.activate(this);
  }

  override unmount(): void {
    super.unmount();
    this.child?.unmount();
    this.dependents.clear();
    this.child = undefined;
  }

  /*
    Copy-on-write override of the parent map (Flutter's
    InheritedElement._updateInheritance): descendants get this provider's
    entry while siblings and ancestors keep the parent's map untouched. A
    nearer provider with the same key naturally wins because it overwrites
    the inherited entry in its own copy.
  */
  protected override updateInheritance(): void {
    const incoming = this.parent?.inheritedProviders;
    const inheritedProviders: Map<unknown, Element> =
      incoming != null ? new Map(incoming) : new Map();
    inheritedProviders.set(this.providerKey, this);
    this.inheritedProviders = inheritedProviders;
  }

  update(newWidget: Widget): void {
    const oldWidget = this.widget;
    super.update(newWidget);
    if (oldWidget.providerKey !== this.widget.providerKey) {
      /*
        Widget.canUpdate compares type and key only, so an in-place update may
        change providerKey; the descendant map snapshots would otherwise keep
        the stale entry.
      */
      this.refreshInheritanceRecursively();
    }
    if (this.widget.updateShouldNotify(oldWidget)) {
      this.notifyClients(oldWidget);
    }
    this.performRebuild();
  }

  protected override performRebuild(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.child = this.updateChild(this.child, this.widget.child) ?? undefined;
  }

  constructor(widget: Provider<ProviderKey, Value>) {
    super(widget);
    this.widget = widget;
  }

  registerDependent(element: Element) {
    this.dependents.add(element);
  }

  unregisterDependent(element: Element) {
    this.dependents.delete(element);
  }

  notifyClients(_oldWidget: Provider<ProviderKey, Value>) {
    Array.from(this.dependents).forEach(dependent => {
      dependent.didChangeDependencies();
    });
  }

  forgetChild(child: Element) {
    if (this.child === child) {
      this.child = undefined;
    }
  }
}

export type ProviderProps<ProviderKey, Value> = {
  providerKey: ProviderKey;
  value: Value;
  child: Widget;
  key?: any;
  notifyToken?: unknown;
  updateShouldNotify?: (
    oldValue: Value,
    newValue: Value,
    oldWidget: Provider<ProviderKey, Value>,
  ) => boolean;
};

export function ProviderFn<ProviderKey, Value>(
  props: ProviderProps<ProviderKey, Value>,
) {
  return new Provider(props);
}

ProviderFn.of = Provider.of;

export default ProviderFn;
