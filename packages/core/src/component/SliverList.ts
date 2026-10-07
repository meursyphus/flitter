import Element, { ElementLifecycleState } from "../element/Element";
import RenderObjectElement from "../element/RenderObjectElement";
import RenderSliverList, {
  RenderSliverFixedExtentList,
  type SliverChildManager,
} from "../renderobject/RenderSliverList";
import RenderObjectWidget from "../widget/RenderObjectWidget";
import Widget from "../widget/Widget";
import type { BuildContext } from "../element";

export type SliverListProps = {
  itemCount: number;
  itemBuilder: (index: number, context: BuildContext) => Widget;
  itemExtent?: number;
  /** Estimated extent used until variable-height rows have been measured. */
  estimatedItemExtent?: number;
  /** Maximum number of off-screen states retained by index (LRU). Default: 20. */
  keepAliveCount?: number;
  key?: any;
};

class SliverListWidget extends RenderObjectWidget {
  readonly props: Required<
    Pick<SliverListProps, "estimatedItemExtent" | "keepAliveCount">
  > &
    SliverListProps;
  constructor(props: SliverListProps) {
    super({ children: [], key: props.key });
    const {
      itemCount,
      itemExtent,
      estimatedItemExtent = 50,
      keepAliveCount = 20,
    } = props;
    if (!Number.isSafeInteger(itemCount) || itemCount < 0)
      throw new RangeError("itemCount must be a non-negative integer");
    if (itemExtent != null && (!Number.isFinite(itemExtent) || itemExtent <= 0))
      throw new RangeError("itemExtent must be finite and positive");
    if (!Number.isFinite(estimatedItemExtent) || estimatedItemExtent <= 0)
      throw new RangeError("estimatedItemExtent must be finite and positive");
    if (!Number.isSafeInteger(keepAliveCount) || keepAliveCount < 0)
      throw new RangeError("keepAliveCount must be a non-negative integer");
    this.props = { ...props, estimatedItemExtent, keepAliveCount };
  }
  override createElement(): SliverListElement {
    return new SliverListElement(this);
  }
  override createRenderObject(): RenderSliverList {
    return this.props.itemExtent == null
      ? new RenderSliverList(this.props)
      : new RenderSliverFixedExtentList({
          itemCount: this.props.itemCount,
          itemExtent: this.props.itemExtent,
        });
  }
  override updateRenderObject(render: RenderSliverList): void {
    render.update(
      this.props.itemCount,
      this.props.itemExtent,
      this.props.estimatedItemExtent,
    );
  }
}

type ChildEntry = { element: Element; revision: number };

/** Owns the active window and a bounded inactive cache, separate from finalizeTree. */
export class SliverListElement
  extends RenderObjectElement
  implements SliverChildManager
{
  private active = new Map<number, ChildEntry>();
  private keptAlive = new Map<number, ChildEntry>();
  private revision = 0;
  get activeIndices(): number[] {
    return [...this.active.keys()].sort((a, b) => a - b);
  }
  get keptAliveChildCount(): number {
    return this.keptAlive.size;
  }
  private get props() {
    return (this.widget as SliverListWidget).props;
  }

  createChild(index: number) {
    let entry = this.active.get(index);
    if (entry != null && entry.revision === this.revision)
      return entry.element.renderObject;
    if (entry == null) {
      entry = this.keptAlive.get(index);
      this.keptAlive.delete(index);
      // A GlobalKey may have reparented a retained element into another tree.
      if (
        entry != null &&
        entry.element.lifecycleState !== ElementLifecycleState.inactive
      )
        entry = undefined;
    }
    const widget =
      entry?.revision === this.revision
        ? entry.element.widget
        : this.props.itemBuilder(index, this);
    if (!(widget instanceof Widget))
      throw new Error("itemBuilder must return a Widget");
    if (entry?.element.lifecycleState === ElementLifecycleState.inactive) {
      if (Widget.canUpdate(entry.element.widget, widget)) {
        entry.element.activate(this);
        entry.element.update(widget);
      } else {
        entry.element.unmount();
        entry = undefined;
      }
    } else if (entry != null) {
      entry.element = this.updateChild(entry.element, widget)!;
    }
    if (entry == null)
      entry = { element: this.inflateWidget(widget), revision: this.revision };
    entry.revision = this.revision;
    this.active.set(index, entry);
    this.syncChildren();
    return entry.element.renderObject;
  }

  collectGarbage(first: number, last: number): void {
    let changed = false;
    for (const [index, entry] of this.active) {
      if (index >= first && index <= last && index < this.props.itemCount)
        continue;
      this.active.delete(index);
      // Keep these outside BuildOwner's end-of-frame disposal queue. Their
      // lifecycle and render subtree are still fully deactivated.
      entry.element.parent = undefined;
      entry.element.detachRenderObject();
      entry.element.deactivate();
      this.keptAlive.set(index, entry);
      changed = true;
    }
    for (const [index, entry] of this.keptAlive) {
      if (
        index < this.props.itemCount &&
        this.keptAlive.size <= this.props.keepAliveCount
      )
        continue;
      this.keptAlive.delete(index);
      if (entry.element.lifecycleState === ElementLifecycleState.inactive)
        entry.element.unmount();
    }
    if (changed) this.syncChildren();
  }

  override performRebuild(): void {
    this.revision++;
    (this.widget as SliverListWidget).updateRenderObject(
      this._renderObject as RenderSliverList,
    );
    this.collectGarbage(0, this.props.itemCount - 1);
  }
  override forgetChild(child: Element): void {
    for (const [index, entry] of this.active)
      if (entry.element === child) this.active.delete(index);
    for (const [index, entry] of this.keptAlive)
      if (entry.element === child) this.keptAlive.delete(index);
    this.syncChildren();
  }
  override unmount(): void {
    for (const { element } of this.keptAlive.values()) {
      if (element.lifecycleState === ElementLifecycleState.inactive)
        element.unmount();
    }
    this.keptAlive.clear();
    super.unmount();
    this.active.clear();
  }
  private syncChildren(): void {
    const next = this.activeIndices.map(
      index => this.active.get(index)!.element,
    );
    if (
      next.length === this.children.length &&
      next.every((child, index) => child === this.children[index])
    )
      return;
    this.children = next;
    this._renderObject.markNeedsChildrenUpdate();
  }
}

export default function SliverList(props: SliverListProps): Widget {
  return new SliverListWidget(props);
}
export function SliverFixedExtentList(
  props: SliverListProps & { itemExtent: number },
): Widget {
  return new SliverListWidget(props);
}
