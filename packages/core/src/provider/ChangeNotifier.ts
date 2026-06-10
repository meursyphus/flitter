import { Listenable } from "../listenable";
import type { VoidCallback } from "../utils/type";

class ChangeNotifier extends Listenable {
  // Slots are nulled (not spliced) when a listener is removed while a
  // notification is in flight, so in-progress iterations keep stable indices.
  private listeners: (VoidCallback | null)[] = [];
  private notificationCallStackDepth = 0;
  private reentrantlyRemovedListeners = 0;

  addListener(listener: VoidCallback): void {
    this.listeners.push(listener);
  }

  removeListener(listener: VoidCallback): void {
    const listeners = this.listeners;
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i] === listener) {
        if (this.notificationCallStackDepth > 0) {
          listeners[i] = null;
          this.reentrantlyRemovedListeners++;
        } else {
          listeners.splice(i, 1);
        }
        break;
      }
    }
  }

  notifyListeners() {
    const listeners = this.listeners;
    if (listeners.length === 0) return;

    this.notificationCallStackDepth++;
    // Snapshot the length so listeners added during this notification are not
    // called by it; removed ones are skipped via their nulled slots.
    const end = listeners.length;
    try {
      for (let i = 0; i < end; i++) {
        listeners[i]?.();
      }
    } finally {
      this.notificationCallStackDepth--;
      if (
        this.notificationCallStackDepth === 0 &&
        this.reentrantlyRemovedListeners > 0
      ) {
        // Outermost notification finished: compact away nulled slots in place.
        let writeIndex = 0;
        for (let readIndex = 0; readIndex < listeners.length; readIndex++) {
          const listener = listeners[readIndex];
          if (listener != null) {
            listeners[writeIndex++] = listener;
          }
        }
        listeners.length = writeIndex;
        this.reentrantlyRemovedListeners = 0;
      }
    }
  }
}

export default ChangeNotifier;
