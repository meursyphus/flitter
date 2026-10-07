import AnimationController from "../animation/AnimationController";
import type Curve from "../animation/Curve";
import Listenable from "../listenable";

export type ScrollMetrics = {
  minScrollExtent?: number;
  maxScrollExtent: number;
  viewportDimension: number;
};

/** A single scroll position shared by a scrollable and its consumers. */
export default class ScrollController extends Listenable {
  private listeners = new Set<() => void>();
  private position: number;
  private animation: AnimationController | null = null;
  private finishAnimation: (() => void) | null = null;
  private disposed = false;
  private hasDimensions = false;
  private minimum = 0;
  private maximum = 0;
  private viewport = 0;

  constructor({
    initialScrollOffset = 0,
  }: { initialScrollOffset?: number } = {}) {
    super();
    if (!Number.isFinite(initialScrollOffset) || initialScrollOffset < 0) {
      throw new RangeError(
        "initialScrollOffset must be finite and non-negative",
      );
    }
    this.position = initialScrollOffset;
  }

  get offset() {
    return this.position;
  }
  get minScrollExtent() {
    return this.minimum;
  }
  get maxScrollExtent() {
    return this.maximum;
  }
  get viewportDimension() {
    return this.viewport;
  }
  get hasContentDimensions() {
    return this.hasDimensions;
  }
  get isAnimating() {
    return this.animation != null;
  }

  /** Called by a scrollable after layout. Returns whether the offset changed. */
  updateMetrics({
    minScrollExtent = 0,
    maxScrollExtent,
    viewportDimension,
  }: ScrollMetrics): boolean {
    if (this.disposed) return false;
    if (
      ![minScrollExtent, maxScrollExtent, viewportDimension].every(
        Number.isFinite,
      ) ||
      maxScrollExtent < minScrollExtent ||
      viewportDimension < 0
    ) {
      throw new RangeError("Scroll metrics must be finite with valid extents");
    }
    const changed =
      !this.hasDimensions ||
      this.minimum !== minScrollExtent ||
      this.maximum !== maxScrollExtent ||
      this.viewport !== viewportDimension;
    this.minimum = minScrollExtent;
    this.maximum = maxScrollExtent;
    this.viewport = viewportDimension;
    this.hasDimensions = true;
    const previous = this.position;
    this.position = this.clamp(this.position);
    if (changed || previous !== this.position) this.notifyListeners();
    return previous !== this.position;
  }

  jumpTo(offset: number): void {
    this.checkOffset(offset);
    this.stop();
    this.setOffset(offset);
  }

  animateTo(
    offset: number,
    { duration = 300, curve }: { duration?: number; curve?: Curve } = {},
  ): Promise<void> {
    this.checkOffset(offset);
    if (!Number.isFinite(duration) || duration < 0)
      throw new RangeError("duration must be non-negative");
    this.stop();
    const target = this.clamp(offset);
    if (duration === 0 || target === this.position) {
      this.setOffset(target);
      return Promise.resolve();
    }
    const from = this.position;
    const animation = new AnimationController({ duration });
    this.animation = animation;
    return new Promise(resolve => {
      this.finishAnimation = resolve;
      animation.addListener(() => {
        this.setOffset(
          from +
            (target - from) *
              (curve?.transform(animation.value) ?? animation.value),
        );
        if (animation.value === 1) this.stop();
      });
      animation.forward();
    });
  }

  /** Also resolves an interrupted animateTo promise. */
  stop(): void {
    const animation = this.animation;
    this.animation = null;
    animation?.dispose();
    const finish = this.finishAnimation;
    this.finishAnimation = null;
    finish?.();
  }

  override addListener(listener: () => void): void {
    if (!this.disposed) this.listeners.add(listener);
  }
  override removeListener(listener: () => void): void {
    this.listeners.delete(listener);
  }
  dispose(): void {
    this.stop();
    this.disposed = true;
    this.listeners.clear();
  }
  private clamp(offset: number): number {
    return this.hasDimensions
      ? Math.min(this.maximum, Math.max(this.minimum, offset))
      : Math.max(0, offset);
  }
  private checkOffset(offset: number): void {
    if (this.disposed) throw new Error("ScrollController is disposed");
    if (!Number.isFinite(offset))
      throw new RangeError("scroll offset must be finite");
  }
  private setOffset(offset: number): void {
    const next = this.clamp(offset);
    if (this.disposed || next === this.position) return;
    this.position = next;
    this.notifyListeners();
  }
  private notifyListeners(): void {
    [...this.listeners].forEach(listener => listener());
  }
}
