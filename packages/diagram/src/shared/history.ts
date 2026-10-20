/** A pending mark becomes an undo entry only after a meaningful mutation. */
export class SnapshotHistory<T> {
  private undoEntries: T[] = [];
  private redoEntries: T[] = [];
  private pending: T | null = null;
  private marked: T | null = null;
  constructor(
    private readonly capture: () => T,
    private readonly restore: (value: T) => void,
    private readonly equal: (a: T, b: T) => boolean,
    private readonly options: () => { enabled: boolean; limit: number },
    private readonly notify: () => void,
  ) {}
  get canUndo(): boolean {
    return this.options().enabled && this.undoEntries.length > 0;
  }
  get canRedo(): boolean {
    return this.options().enabled && this.redoEntries.length > 0;
  }
  mark(_label?: string): void {
    this.marked = this.capture();
    this.pending = this.options().enabled ? this.marked : null;
  }
  changed(): void {
    if (!this.options().enabled || !this.pending || this.equal(this.pending, this.capture())) return;
    this.undoEntries.push(this.pending);
    this.undoEntries = this.undoEntries.slice(-Math.max(1, this.options().limit));
    this.pending = null;
    this.redoEntries = [];
    this.notify();
  }
  discardMark(): void {
    this.pending = null;
    this.marked = null;
  }
  /** Revert the current gesture without adding a redo entry. */
  cancelMark(): void {
    if (!this.marked) return;
    const snapshot = this.marked;
    if (this.undoEntries[this.undoEntries.length - 1] === snapshot) this.undoEntries.pop();
    this.pending = this.marked = null;
    this.restore(snapshot);
    this.notify();
  }
  undo(): void {
    if (!this.canUndo) return;
    this.pending = null;
    this.redoEntries.push(this.capture());
    this.restore(this.undoEntries.pop()!);
    this.notify();
  }
  redo(): void {
    if (!this.canRedo) return;
    this.pending = null;
    this.undoEntries.push(this.capture());
    this.restore(this.redoEntries.pop()!);
    this.notify();
  }
  clear(): void {
    this.undoEntries = [];
    this.redoEntries = [];
    this.pending = null;
    this.notify();
  }
}
