import Animation from "./Animation";
abstract class Animatable<T> {
  transform(_value: number): T {
    throw new Error("transform must be implemented");
  }
  evaluate(animation: Animation<number>): T {
    return this.transform(animation.value);
  }
  animated(animation: Animation<number>): Animation<T> {
    return new AnimatedEvaluation({ parent: animation, animatable: this });
  }
}

class AnimatedEvaluation<T> extends Animation<T> {
  parent: Animation<number>;
  animatable: Animatable<T>;
  constructor({
    animatable: animatable,
    parent,
  }: {
    animatable: Animatable<T>;
    parent: Animation<number>;
  }) {
    super();
    this.parent = parent;
    this.animatable = animatable;
  }
  get value(): T {
    return this.animatable.evaluate(this.parent);
  }
}

export default Animatable;
