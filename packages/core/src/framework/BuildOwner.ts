import type Element from "../element/Element";
import { ElementLifecycleState } from "../element/Element";
import type GlobalKey from "./Globalkey";
import Widget from "../widget/Widget";

class BuildOwner {
  private onNeedVisualUpdate: () => void;
  private dirtyElements: Element[] = [];
  private dirtyElementsNeedsResorting = false;
  private isFlushingBuild = false;
  private buildScheduled = false;
  private inactiveElements = new Set<Element>();
  private globalKeyRegistry: WeakMap<GlobalKey, Element> = new WeakMap();
  constructor({ onNeedVisualUpdate }: { onNeedVisualUpdate: () => void }) {
    this.onNeedVisualUpdate = () => onNeedVisualUpdate();
  }

  /*
    Depth, then clean-before-dirty at equal depth (Flutter's Element._sort):
    a clean element that gets re-dirtied mid-flush must sort after the
    already-dirty ones at the same depth so the resort never skips it.
  */
  private static elementSort(a: Element, b: Element): number {
    return a.depth - b.depth || Number(a.dirty) - Number(b.dirty);
  }

  scheduleFor(elememt: Element) {
    if (!elememt.inDirtyList) {
      elememt.inDirtyList = true;
      this.dirtyElements.push(elememt);
    }
    if (this.isFlushingBuild) {
      this.dirtyElementsNeedsResorting = true;
    }
    if (!this.buildScheduled && !this.isFlushingBuild) {
      this.buildScheduled = true;
      this.requestVisualUpdate();
    }
  }

  private requestVisualUpdate() {
    this.onNeedVisualUpdate();
  }

  flushBuild() {
    this.isFlushingBuild = true;
    this.buildScheduled = false;
    this.dirtyElements.sort(BuildOwner.elementSort);

    try {
      let index = 0;
      while (
        index < this.dirtyElements.length ||
        this.dirtyElementsNeedsResorting
      ) {
        if (this.dirtyElementsNeedsResorting) {
          this.dirtyElements.sort(BuildOwner.elementSort);
          this.dirtyElementsNeedsResorting = false;
          // Reparenting or a dependency notification can introduce a dirty
          // element before the cursor. Flutter's build scope rewinds over the
          // dirty prefix after resorting so those elements are not dropped.
          while (index > 0 && this.dirtyElements[index - 1].dirty) index--;
        }
        if (index >= this.dirtyElements.length) break;

        const elememt = this.dirtyElements[index];

        if (
          elememt.dirty &&
          elememt.lifecycleState === ElementLifecycleState.active
        ) {
          elememt.rebuild();
        }

        index += 1;
      }
    } finally {
      for (const elememt of this.dirtyElements) {
        elememt.inDirtyList = false;
      }
      this.dirtyElements = [];
      this.isFlushingBuild = false;
      this.dirtyElementsNeedsResorting = false;
      this.buildScheduled = false;
    }
  }

  registerGlobalKey(key: GlobalKey, elememt: Element) {
    key.buildOwner = this;
    this.globalKeyRegistry.set(key, elememt);
  }

  unregisterGlobalKey(key: GlobalKey, elememt: Element) {
    const current = this.globalKeyRegistry.get(key);
    if (current === elememt) {
      this.globalKeyRegistry.delete(key);
    }
  }

  findByGlobalKey(key: GlobalKey): Element | undefined {
    return this.globalKeyRegistry.get(key);
  }

  deactivate(element: Element) {
    if (element.lifecycleState !== ElementLifecycleState.active) return;
    this.inactiveElements.add(element);
    element.deactivate();
  }

  retakeElement(key: GlobalKey, newWidget: Widget): Element | null {
    const element = this.findByGlobalKey(key);
    if (element == null) return null;
    if (!Widget.canUpdate(element.widget, newWidget)) return null;

    if (
      element.parent != null &&
      element.lifecycleState === ElementLifecycleState.active
    ) {
      const parent = element.parent;
      parent.forgetChild?.(element);
      parent.deactivateChild(element);
    }

    if (element.lifecycleState !== ElementLifecycleState.inactive) {
      return null;
    }

    this.inactiveElements.delete(element);
    return element;
  }

  finalizeTree() {
    /*
      finalizeTree is the last per-frame BuildOwner hook (it runs as a
      persistence callback after drawFrame). A scheduleFor issued during
      drawFrame finds the scheduler in its persistence phase where
      ensureVisualUpdate is a no-op, so buildScheduled must not survive the
      frame or the next idle-time scheduleFor would skip its wake-up.
    */
    this.buildScheduled = false;

    if (this.inactiveElements.size === 0) return;

    if (this.inactiveElements.size === 1) {
      const [element] = this.inactiveElements;
      this.inactiveElements.clear();
      if (element.lifecycleState === ElementLifecycleState.inactive) {
        element.unmount();
      }
      return;
    }

    /*
      Deepest-first, matching Flutter's _InactiveElements._unmountAll
      (sorted by Element._sort, iterated in reverse): a detached subtree is
      unmounted before any of its still-inactive ancestors.
    */
    const inactiveElements = Array.from(this.inactiveElements).sort(
      (a, b) => b.depth - a.depth || Number(b.dirty) - Number(a.dirty),
    );
    this.inactiveElements.clear();

    inactiveElements.forEach(element => {
      if (element.lifecycleState === ElementLifecycleState.inactive) {
        element.unmount();
      }
    });
  }
}

export default BuildOwner;
