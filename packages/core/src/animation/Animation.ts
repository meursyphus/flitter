import Listenable from "../listenable";

abstract class Animation<T> extends Listenable {
  get value(): T {
    throw new Error("Animation value must be implemented");
  }

  status: "completed" | "dismissed" | "forward" | "reverse" = "dismissed";
  get isDismissed(): boolean {
    return this.status === "completed";
  }
  get isCompleted(): boolean {
    return this.status === "completed";
  }
}

export default Animation;
