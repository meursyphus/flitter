import { functionalizeClass } from "../utils";
import type { Widget } from "../widget";
import { StatefulWidget } from "../widget";
import type { BuildContext } from "../element";
import { State } from "../element";
import { Offset } from "../type";
import Transform from "./Transform";
import GestureDetector from "./GestureDetector";

class Draggable extends StatefulWidget {
  onDragUpdate?: (detail: { delta: Offset }) => void;
  child: Widget;
  feedback: Widget;
  constructor({
    onDragUpdate: onDragUpdate,
    key,
    child,
    feedback,
  }: {
    onDragUpdate?: (event: { delta: Offset }) => void;
    key?: any;
    child: Widget;
    feedback?: Widget;
  }) {
    super(key);
    this.onDragUpdate = onDragUpdate;
    this.child = child;
    this.feedback = feedback ?? child;
  }

  createState(): State<Draggable> {
    return new DraggableState();
  }
}

class DraggableState extends State<Draggable> {
  origin?: Offset;
  state: "start" | "update" | "end";
  get active() {
    return this.origin != null;
  }
  delta: Offset = Offset.zero();
  lastDelta: Offset = this.delta;
  childKey = 1;

  handleMouseDown = ({ x, y }: MouseEvent): void => {
    this.setState(() => {
      this.origin = new Offset({ x, y });
    });
  };

  handleMouseMove = ({ x, y }: MouseEvent): void => {
    if (this.origin == null) return;
    this.setState(() => {
      this.delta = this.lastDelta.plus(
        new Offset({ x, y }).minus(this.origin!)
      );
      this.widget.onDragUpdate?.({ delta: this.delta });
    });
  };

  handleMouseUp = (_: MouseEvent): void => {
    this.setState(() => {
      this.origin = undefined;
      this.lastDelta = this.delta;
      this.childKey += 1;
    });
  };

  build(_: BuildContext): Widget {
    return Transform.translate({
      offset: this.delta,
      child: GestureDetector({
        onDragStart: this.handleMouseDown,
        onDragMove: this.handleMouseMove,
        onDragEnd: this.handleMouseUp,
        child: this.widget.feedback,
      }),
    });
  }
}

export default functionalizeClass(Draggable);
