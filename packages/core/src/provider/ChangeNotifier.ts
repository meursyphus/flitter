import { Listenable } from "../listenable";
import type { VoidCallback } from "../utils/type";

class ChangeNotifier extends Listenable {
  private listners: VoidCallback[] = [];

  addListener(listener: VoidCallback): void {
    this.listners.push(listener);
  }

  removeListener(listener: VoidCallback): void {
    const index = this.listners.indexOf(listener);
    if (index !== -1) {
      this.listners.splice(index, 1);
    }
  }

  notifyListeners() {
    this.listners.forEach(listner => {
      listner();
    });
  }
}

export default ChangeNotifier;
