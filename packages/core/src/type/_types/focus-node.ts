import ChangeNotifier from "../../provider/ChangeNotifier";

/** A caller-owned focus handle. A node can be attached to one input at a time. */
export default class FocusNode extends ChangeNotifier {
  #focused = false;
  #pending = false;
  #disposed = false;
  #callbacks: (() => void)[] = [];

  override addListener(listener: () => void): void {
    if (this.#disposed) throw new Error("FocusNode is disposed");
    this.#callbacks.push(listener);
    super.addListener(listener);
  }

  override removeListener(listener: () => void): void {
    const index = this.#callbacks.indexOf(listener);
    if (index >= 0) this.#callbacks.splice(index, 1);
    super.removeListener(listener);
  }
  #binding?: { focus: () => void; blur: () => void };

  get hasFocus(): boolean {
    return this.#focused;
  }
  requestFocus(): void {
    if (this.#disposed) throw new Error("FocusNode is disposed");
    this.#pending = true;
    this.#binding?.focus();
  }
  unfocus(): void {
    this.#pending = false;
    this.#binding?.blur();
  }
  /** @internal Connect the native input, returning its detach callback. */
  attach(focus: () => void, blur: () => void): () => void {
    if (this.#disposed) throw new Error("FocusNode is disposed");
    if (this.#binding)
      throw new Error("A FocusNode cannot be shared by multiple TextFields");
    const binding = { focus, blur };
    this.#binding = binding;
    if (this.#pending) focus();
    return () => {
      if (this.#binding !== binding) return;
      this.#binding = undefined;
      this.#pending = false;
      this.updateFocus(false);
    };
  }
  /** @internal Called for real native focus/blur events, including Tab navigation. */
  updateFocus(focused: boolean): void {
    if (this.#disposed) return;
    this.#pending = focused;
    if (this.#focused === focused) return;
    this.#focused = focused;
    this.notifyListeners();
  }
  dispose(): void {
    if (this.#disposed) return;
    this.unfocus();
    this.#binding = undefined;
    this.#disposed = true;
    for (const listener of this.#callbacks) super.removeListener(listener);
    this.#callbacks = [];
  }
}
