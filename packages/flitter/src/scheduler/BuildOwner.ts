import type Element from "../element/Element";
import type GlobalKey from "./Globalkey";

class BuildOwner {
  private onNeedVisualUpdate: () => void;
  private dirtyElements: Element[] = [];
  private globalKeyRegistry: WeakMap<GlobalKey, Element> = new WeakMap();
  constructor({ onNeedVisualUpdate }: { onNeedVisualUpdate: () => void }) {
    this.onNeedVisualUpdate = () => onNeedVisualUpdate();
  }

  scheduleFor(elememt: Element) {
    this.dirtyElements.push(elememt);
    this.requestVisualUpdate();
  }

  private requestVisualUpdate() {
    this.onNeedVisualUpdate();
  }

  flushBuild() {
    const dirtyElements = this.dirtyElements;
    this.dirtyElements = [];

    dirtyElements
      .sort((a, b) => a.depth - b.depth)
      .forEach((elememt) => {
        if (!elememt.dirty) return;
        elememt.rebuild();
      });
  }

  registerGlobalKey(key: GlobalKey, elememt: Element) {
    key.buildOwner = this;
    this.globalKeyRegistry.set(key, elememt);
  }

  findByGlobalKey(key: GlobalKey): Element {
    const result = this.globalKeyRegistry.get(key);
    return result;
  }
}

export default BuildOwner;
