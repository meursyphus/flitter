import ChangeNotifier from "../../provider/ChangeNotifier";

export type TextSelection = Readonly<{ start: number; end: number }>;
export type TextEditingValue = Readonly<{
  text: string;
  selection: TextSelection;
}>;

/** Owns editable text and its UTF-16 selection, matching native textarea offsets. */
export default class TextEditingController extends ChangeNotifier {
  #value: TextEditingValue;
  #disposed = false;
  #callbacks: (() => void)[] = [];

  override addListener(listener: () => void): void {
    if (this.#disposed) throw new Error("TextEditingController is disposed");
    this.#callbacks.push(listener);
    super.addListener(listener);
  }

  override removeListener(listener: () => void): void {
    const index = this.#callbacks.indexOf(listener);
    if (index >= 0) this.#callbacks.splice(index, 1);
    super.removeListener(listener);
  }

  constructor(text = "") {
    super();
    this.#value = this.normalize({
      text,
      selection: { start: text.length, end: text.length },
    });
  }

  get value(): TextEditingValue {
    return this.#value;
  }
  set value(value: TextEditingValue) {
    if (this.#disposed) throw new Error("TextEditingController is disposed");
    const next = this.normalize(value);
    if (
      next.text === this.text &&
      next.selection.start === this.selection.start &&
      next.selection.end === this.selection.end
    )
      return;
    this.#value = next;
    this.notifyListeners();
  }

  get text(): string {
    return this.#value.text;
  }
  set text(text: string) {
    this.value = { text, selection: { start: text.length, end: text.length } };
  }
  get selection(): TextSelection {
    return this.#value.selection;
  }
  set selection(selection: TextSelection) {
    this.value = { text: this.text, selection };
  }
  clear(): void {
    this.text = "";
  }
  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    for (const listener of this.#callbacks) super.removeListener(listener);
    this.#callbacks = [];
  }

  private normalize({ text, selection }: TextEditingValue): TextEditingValue {
    const clamp = (offset: number) =>
      Math.max(
        0,
        Math.min(text.length, Number.isFinite(offset) ? Math.trunc(offset) : 0),
      );
    const start = clamp(selection.start);
    const end = clamp(selection.end);
    return Object.freeze({
      text,
      selection: Object.freeze({
        start: Math.min(start, end),
        end: Math.max(start, end),
      }),
    });
  }
}
