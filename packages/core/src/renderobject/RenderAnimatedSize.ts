import AnimationController from "../animation/AnimationController";
import CurvedAnimation from "../animation/CurvedAnimation";
import type Curve from "../animation/Curve";
import Curves from "../animation/Curves";
import { Alignment, Size, TextDirection } from "../type";
import { RenderAligningShiftedBox } from "./RenderAligningShiftedBox";

enum RenderAnimatedSizePhase {
  start = "start",
  stable = "stable",
  changed = "changed",
  unstable = "unstable",
}

export class RenderAnimatedSize extends RenderAligningShiftedBox {
  private _controller: AnimationController;
  private _animation: CurvedAnimation;
  private _phase: RenderAnimatedSizePhase = RenderAnimatedSizePhase.start;
  private _lastChildSize: Size = Size.zero;
  private _beginSize: Size = Size.zero;
  private _targetSize: Size = Size.zero;

  private _duration: number;
  get duration(): number {
    return this._duration;
  }
  set duration(value: number) {
    if (this._duration === value) return;
    this._duration = value;
    this._controller.duration = value;
  }

  private _curve: Curve;
  get curve(): Curve {
    return this._curve;
  }
  set curve(value: Curve) {
    if (this._curve === value) return;
    this._curve = value;
    this._animation = new CurvedAnimation({
      parent: this._controller,
      curve: value,
    });
  }

  constructor({
    duration,
    curve = Curves.linear,
    alignment = Alignment.center,
  }: {
    duration: number;
    curve?: Curve;
    alignment?: Alignment;
  }) {
    super({ alignment, textDirection: TextDirection.ltr });
    this._duration = duration;
    this._curve = curve;
    this._controller = new AnimationController({ duration });
    this._animation = new CurvedAnimation({
      parent: this._controller,
      curve,
    });
    this._controller.addListener(() => {
      if (this._controller.isAnimating) {
        this.markNeedsLayout();
      }
    });
  }

  override dispose() {
    this._controller.dispose();
    super.dispose();
  }

  private get animatedSize(): Size {
    const t = this._animation.value;
    return new Size({
      width:
        this._beginSize.width +
        (this._targetSize.width - this._beginSize.width) * t,
      height:
        this._beginSize.height +
        (this._targetSize.height - this._beginSize.height) * t,
    });
  }

  protected override preformLayout(): void {
    if (this.child == null) {
      this.size = this.constraints.constrain(Size.zero);
      return;
    }

    this.child.layout(this.constraints, { parentUsesSize: true });

    const childSize = this.child.size;

    switch (this._phase) {
      case RenderAnimatedSizePhase.start:
        this._lastChildSize = childSize;
        this._beginSize = childSize;
        this._targetSize = childSize;
        this._phase = RenderAnimatedSizePhase.stable;
        break;

      case RenderAnimatedSizePhase.stable:
        if (!childSize.equal(this._lastChildSize)) {
          this._beginSize = this.animatedSize;
          this._targetSize = childSize;
          this._lastChildSize = childSize;
          this._controller.forward({ from: 0 });
          this._phase = RenderAnimatedSizePhase.changed;
        }
        break;

      case RenderAnimatedSizePhase.changed:
        if (!childSize.equal(this._targetSize)) {
          this._beginSize = this.animatedSize;
          this._targetSize = childSize;
          this._lastChildSize = childSize;
          this._controller.forward({ from: 0 });
          this._phase = RenderAnimatedSizePhase.unstable;
        } else {
          this._lastChildSize = childSize;
          if (this._controller.isCompleted) {
            this._phase = RenderAnimatedSizePhase.stable;
          }
        }
        break;

      case RenderAnimatedSizePhase.unstable:
        if (!childSize.equal(this._targetSize)) {
          this._beginSize = this.animatedSize;
          this._targetSize = childSize;
          this._lastChildSize = childSize;
          this._controller.forward({ from: 0 });
        } else {
          this._lastChildSize = childSize;
          if (this._controller.isCompleted) {
            this._phase = RenderAnimatedSizePhase.stable;
          }
        }
        break;
    }

    this.size = this.constraints.constrain(this.animatedSize);
    this.alignChild();
  }
}

export default RenderAnimatedSize;
