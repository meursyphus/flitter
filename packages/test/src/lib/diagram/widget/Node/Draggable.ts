import { GestureDetector, Offset, State, StatefulWidget, Widget } from '@meursyphus/flitter';
import { classToFunction } from '../utils';

class Draggable extends StatefulWidget {
	onDragUpdate?: (detail: { delta: Offset; movement: Offset }) => void;
	onDragStart?: () => void;
	onDragEnd?: () => void;
	child: Widget;
	feedback: Widget;
	constructor({
		onDragUpdate: onDragUpdate,
		onDragStart: onDragStart,
		onDragEnd: onDragEnd,
		key,
		child,
		feedback
	}: {
		onDragUpdate?: (event: { delta: Offset; movement: Offset }) => void;
		onDragStart?: () => void;
		onDragEnd?: () => void;
		key?: unknown;
		child: Widget;
		feedback?: Widget;
	}) {
		super(key);
		this.onDragUpdate = onDragUpdate;
		this.onDragStart = onDragStart;
		this.onDragEnd = onDragEnd;
		this.child = child;
		this.feedback = feedback ?? child;
	}

	createState(): State<Draggable> {
		return new DraggableState();
	}
}

class DraggableState extends State<Draggable> {
	origin?: Offset;
	get active() {
		return this.origin != null;
	}
	delta: Offset = Offset.zero();

	handleDragStart = (e: MouseEvent): void => {
		e.stopPropagation();
		e.preventDefault();
		const { x, y } = e;
		this.origin = new Offset({ x, y });
		this.widget.onDragStart?.();
	};

	handleDragMove = (e: MouseEvent): void => {
		const { x, y } = e;
		if (this.origin == null) return;
		e.stopPropagation();
		const oldDelta = this.delta;
		const newDelta = new Offset({ x, y }).minus(this.origin!);

		this.delta = newDelta;
		this.widget.onDragUpdate?.({ delta: newDelta, movement: newDelta.minus(oldDelta) });
	};

	handleDragEnd = (): void => {
		this.origin = undefined;
		this.delta = Offset.zero();
		this.widget.onDragEnd?.();
	};

	build(): Widget {
		return GestureDetector({
			onDragStart: this.handleDragStart,
			onDragMove: this.handleDragMove,
			onDragEnd: this.handleDragEnd,
			child: this.widget.feedback,
			cursor: 'move',
			bubble: {
				wheel: true,
				mouseleave: true,
				mouseenter: true
			}
		});
	}
}

export default classToFunction(Draggable);
