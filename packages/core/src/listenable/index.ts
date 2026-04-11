import type { VoidCallback } from "..";
abstract class Listenable {
  addListener(_listener: VoidCallback): void {
    throw new Error("addListener must be implemented");
  }
  removeListener(_listener: VoidCallback): void {
    throw new Error("removeListener must be implemented");
  }
}

export default Listenable;

export { Listenable };
