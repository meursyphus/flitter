import type { VoidCallback } from "../utils/type";
import ChangeNotifier from "./ChangeNotifier";

function ReactiveChangeNotifier<V>(value: V) {
  const notifier = new ChangeNotifier();
  function reactivate(obj: any) {
    return new Proxy(obj, {
      set(target, key, value) {
        if (target[key] === value) return false;
        target[key] = value;
        notifier.notifyListeners();
        return true;
      },
      get(target, key) {
        if (typeof target[key] !== "object") {
          return target[key];
        }

        return reactivate(target[key]);
      },
    });
  }

  return {
    ...reactivate(value),
    addListener: (listener: VoidCallback) => notifier.addListener(listener),
    removeListener: (listener: VoidCallback) =>
      notifier.removeListener(listener),
  } as V & ChangeNotifier;
}

export default ReactiveChangeNotifier;
