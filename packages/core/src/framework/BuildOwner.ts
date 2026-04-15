import type Element from "../element/Element";
import { ElementLifecycleState } from "../element/Element";
import type GlobalKey from "./Globalkey";
import Widget from "../widget/Widget";

class BuildOwner {
  private onNeedVisualUpdate: () => void;
  private dirtyElements: Element[] = [];
  private dirtyElementSet = new Set<Element>();
  private dirtyElementsNeedsResorting = false;
  private isFlushingBuild = false;
  private inactiveElements = new Set<Element>();
  private globalKeyRegistry: WeakMap<GlobalKey, Element> = new WeakMap();
  constructor({ onNeedVisualUpdate }: { onNeedVisualUpdate: () => void }) {
    this.onNeedVisualUpdate = () => onNeedVisualUpdate();
  }

  scheduleFor(elememt: Element) {
    if (this.dirtyElementSet.has(elememt)) return;
    this.dirtyElementSet.add(elememt);
    this.dirtyElements.push(elememt);
    if (this.isFlushingBuild) {
      this.dirtyElementsNeedsResorting = true;
    }
    this.requestVisualUpdate();
  }

  private requestVisualUpdate() {
    this.onNeedVisualUpdate();
  }

  flushBuild() {
    this.isFlushingBuild = true;
    this.dirtyElements.sort((a, b) => a.depth - b.depth);

    let index = 0;
    while (index < this.dirtyElements.length) {
      if (this.dirtyElementsNeedsResorting) {
        this.dirtyElements.sort((a, b) => a.depth - b.depth);
        this.dirtyElementsNeedsResorting = false;
      }

      const elememt = this.dirtyElements[index];
      this.dirtyElementSet.delete(elememt);

      if (
        elememt.dirty &&
        elememt.lifecycleState === ElementLifecycleState.active
      ) {
        elememt.rebuild();
      }

      index += 1;
    }

    this.isFlushingBuild = false;
    this.dirtyElementsNeedsResorting = false;
    this.dirtyElements = [];
    this.dirtyElementSet.clear();
    this.finalizeTree();
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
    if (this.inactiveElements.size === 0) return;

    if (this.inactiveElements.size === 1) {
      const [element] = this.inactiveElements;
      this.inactiveElements.clear();
      if (element.lifecycleState === ElementLifecycleState.inactive) {
        element.unmount();
      }
      return;
    }

    const inactiveElements = Array.from(this.inactiveElements);
    this.inactiveElements.clear();

    inactiveElements.forEach(element => {
      if (element.lifecycleState === ElementLifecycleState.inactive) {
        element.unmount();
      }
    });
  }
}

export default BuildOwner;
