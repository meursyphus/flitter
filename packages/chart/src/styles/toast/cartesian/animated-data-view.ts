import {
  StatefulWidget,
  State,
  AnimationController,
  CurvedAnimation,
  Curves,
  Tween,
  ClipRect,
  type Widget,
} from "flitter-core";
import { Rect } from "flitter-core";

export class AnimatedDataView extends StatefulWidget {
  child: Widget;
  duration: number;
  isVertical: boolean;
  baselineRatio: number;

  constructor({
    child,
    duration,
    isVertical,
    baselineRatio,
  }: {
    child: Widget;
    duration: number;
    isVertical: boolean;
    baselineRatio: number;
  }) {
    super();
    this.child = child;
    this.duration = duration;
    this.isVertical = isVertical;
    this.baselineRatio = baselineRatio;
  }

  createState() {
    return new _AnimatedDataViewState();
  }
}

class _AnimatedDataViewState extends State<AnimatedDataView> {
  animationController!: AnimationController;
  tweenAnimation!: { value: number };

  override initState() {
    this.animationController = new AnimationController({
      duration: this.widget.duration,
    });
    this.animationController.addListener(() => this.setState());
    const tween = new Tween({ begin: 0, end: 1 });
    this.tweenAnimation = tween.animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeInOut,
      }),
    );
    this.animationController.forward();
  }

  override dispose() {
    this.animationController.dispose();
  }

  override build() {
    const { child, isVertical, baselineRatio } = this.widget;
    const t = this.tweenAnimation.value;
    const done = t >= 1;

    return ClipRect({
      clipped: !done,
      clipper: (size) => {
        if (isVertical) {
          const baselineY = size.height * (1 - baselineRatio);
          const top = baselineY * (1 - t);
          const bottom = baselineY + (size.height - baselineY) * t;
          return Rect.fromLTRB({
            left: 0,
            top,
            right: size.width,
            bottom,
          });
        } else {
          const baselineX = size.width * baselineRatio;
          const left = baselineX * (1 - t);
          const right = baselineX + (size.width - baselineX) * t;
          return Rect.fromLTRB({
            left,
            top: 0,
            right,
            bottom: size.height,
          });
        }
      },
      child,
    });
  }
}
