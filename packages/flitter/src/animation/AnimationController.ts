import { animate, linear } from "popmotion";
import Utils from "../utils";
import Animation from "./Animation";
class AnimationController extends Animation<number> {
  isAnimating = false;
  get isDismissed() {
    return this.status === "dismissed";
  }
  get isCompleted() {
    return this.status === "completed";
  }
  _value: number = 0;
  get value(): number {
    if (this._value == null) return 0;
    return this._value;
  }
  private set value(value) {
    this.stop();
    this.internalSetValue(value);
    this.notifyListeners();
  }
  private internalSetValue(value: number) {
    this._value = Utils.clampDouble(value, this.lowerBound, this.upperBound);
    if (value === this.lowerBound) {
      this.status = "dismissed";
    } else if (value === this.upperBound) {
      this.status = "completed";
    } else if (this.direction === "forward") {
      this.status = "forward";
    } else {
      this.status = "reverse";
    }
  }
  private direction: "forward" | "reverse";
  private readonly lowerBound: number;
  private readonly upperBound: number;
  duration: number;
  private animation: {
    stop: () => void;
  } | null = null;
  private listeners: (() => void)[] = [];
  constructor({
    value,
    duration,
    lowerBound = 0,
    upperBound = 1,
  }: {
    value?: number;
    lowerBound?: number;
    upperBound?: number;
    duration: number;
  }) {
    super();
    this.duration = duration;
    this.upperBound = upperBound;
    this.lowerBound = lowerBound;
    this.internalSetValue(value ?? lowerBound);
    this.direction = "forward";
  }

  reset() {
    this.internalSetValue(this.lowerBound);
    return this;
  }

  forward({ from }: { from?: number } = {}) {
    if (from != null) {
      this.value = from;
    }
    this.direction = "forward";
    this.animate(this.upperBound);
    return this;
  }
  reverse({ from }: { from?: number } = {}) {
    if (from != null) {
      this.value = from;
    }
    this.direction = "reverse";
    this.animate(this.lowerBound);
    return this;
  }
  repeat({ reverse = false }: { reverse?: boolean } = {}) {
    const repeat = () => {
      this.animate(
        this.direction === "forward" ? this.upperBound : this.lowerBound,
        {
          onComplete: () => {
            if (reverse) {
              this.direction =
                this.direction === "forward" ? "reverse" : "forward";
            } else {
              this._value = this.lowerBound;
              this.notifyListeners();
            }
            repeat();
          },
        }
      );
    };
    repeat();
    return this;
  }

  stop() {
    this.animation?.stop();
    this.status = "dismissed";
  }

  dispose() {
    this.animation?.stop();
  }

  private animate(
    target: number,
    overrideOptions: { onComplete?: () => void } = {}
  ) {
    if (typeof window === "undefined") return;
    this.animation?.stop();
    this.animation = animate({
      from: this.value,
      to: target,
      duration:
        this.duration *
        (Math.abs(this.value - target) / (this.upperBound - this.lowerBound)),
      ease: linear,
      onPlay: () => {
        this.isAnimating = true;
      },
      onUpdate: (latest) => {
        this.internalSetValue(latest);
        this.notifyListeners();
      },
      onStop: () => {
        this.isAnimating = false;
      },
      onComplete: () => {
        this.isAnimating = false;
      },
      ...overrideOptions,
    });
  }
  addListener(callback: () => void) {
    this.listeners.push(callback);
  }
  removeListener(callback: () => void) {
    this.listeners = this.listeners.filter((listenr) => listenr !== callback);
  }
  clearListeners() {
    this.listeners = [];
  }
  notifyListeners() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }
}

export default AnimationController;
