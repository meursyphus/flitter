import { Listenable } from "../listenable";
import type { VoidCallback } from "../utils/type";

class ChangeNotifier extends Listenable {
  private listners: VoidCallback[] = [];

  addListener(listener: VoidCallback): void {
    this.listners.push(listener);
  }

  notifyListeners() {
    this.listners.forEach((listner) => {
      listner();
    });
  }
}

export default ChangeNotifier;
