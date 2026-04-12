import type Element from "../element/Element";
import type GlobalKey from "./Globalkey";

class BuildOwner {
  private onNeedVisualUpdate: () => void;
  private dirtyElements: Element[] = [];
  private dirtyElementSet: Set<Element> = new Set();
  private inactiveElements: Set<Element> = new Set();
  private globalKeyRegistry: WeakMap<GlobalKey, Element> = new WeakMap();
  constructor({ onNeedVisualUpdate }: { onNeedVisualUpdate: () => void }) {
    this.onNeedVisualUpdate = () => onNeedVisualUpdate();
  }

  scheduleFor(elememt: Element) {
    if (this.dirtyElementSet.has(elememt)) return;
    this.dirtyElementSet.add(elememt);
    this.dirtyElements.push(elememt);
    this.requestVisualUpdate();
  }

  private requestVisualUpdate() {
    this.onNeedVisualUpdate();
  }

  flushBuild() {
    const dirtyElements = this.dirtyElements;
    this.dirtyElements = [];
    this.dirtyElementSet = new Set();

    dirtyElements
      .sort((a, b) => a.depth - b.depth)
      .forEach(elememt => {
        if (!elememt.dirty) return;
        elememt.rebuild();
      });
  }

  addToInactiveElements(element: Element) {
    this.deactivateRecursively(element);
    this.inactiveElements.add(element);
  }

  removeFromInactiveElements(element: Element) {
    this.inactiveElements.delete(element);
  }

  finalizeTree() {
    if (this.inactiveElements.size === 0) return;
    const inactiveElements = [...this.inactiveElements].sort(
      (a, b) => a.depth - b.depth,
    );
    this.inactiveElements.clear();

    for (let i = inactiveElements.length - 1; i >= 0; i--) {
      inactiveElements[i].unmountRecursively();
    }
  }

  registerGlobalKey(key: GlobalKey, elememt: Element) {
    key.buildOwner = this;
    this.globalKeyRegistry.set(key, elememt);
  }

  unregisterGlobalKey(key: GlobalKey, element: Element) {
    if (this.globalKeyRegistry.get(key) !== element) return;
    this.globalKeyRegistry.delete(key);
  }

  findByGlobalKey(key: GlobalKey): Element | undefined {
    return this.globalKeyRegistry.get(key);
  }

  private deactivateRecursively(element: Element) {
    element.deactivate();
    element.visitChildren(child => {
      this.deactivateRecursively(child);
    });
  }
}

export default BuildOwner;
