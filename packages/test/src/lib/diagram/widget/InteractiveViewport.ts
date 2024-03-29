import {
	StatefulWidget,
	State,
	Container,
	Offset,
	Widget,
	ConstraintsTransformBox,
	Alignment,
	BuildContext
} from '@meursyphus/flitter';
import { classToFunction, clamp } from './utils';
import DiagramControllerProvider from './Provider/DiagramControllerProvider';
import type { DiagramController } from '../controller';

const SCALE_SENSITIVITY = 500;

class InteractiveViewport extends StatefulWidget {
	child: Widget;
	constructor({ child }: { child: Widget }) {
		super();
		this.child = child;
	}

	createState(): State<StatefulWidget> {
		return new InteractiveViewportState();
	}
}

class InteractiveViewportState extends State<InteractiveViewport> {
	scaleOrigin: Offset = Offset.zero();
	controller!: DiagramController;
	view!: SVGSVGElement;
	viedBox!: { x: number; y: number; width: number; height: number };
	resizeObserver!: ResizeObserver;
	dragPoint: Offset | null = null;
	initState(context: BuildContext) {
		this.controller = DiagramControllerProvider.of(context);
		this.view = context.renderContext.view;

		if (typeof window === 'undefined') return;
		this.view.addEventListener('wheel', this.handleWheel);
		this.view.parentElement!.addEventListener('mousedown', this.handleDragStart);
		this.view.setAttribute('preserveAspectRatio', 'none');
		document.addEventListener('mousemove', this.handleDragMove);
		document.addEventListener('mouseup', this.handleDragEnd);
		this.viedBox = {
			x: 0,
			y: 0,
			width: this.view.clientWidth,
			height: this.view.clientHeight
		};
		this.resizeObserver = new ResizeObserver(this.handleResizeView);
		this.resizeObserver.observe(this.view);
	}

	dispose(): void {
		this.view.removeEventListener('wheel', this.handleWheel);
		this.view.parentElement!.removeEventListener('mousedown', this.handleDragStart);
		document.removeEventListener('mousemove', this.handleDragMove);
		document.removeEventListener('mouseup', this.handleDragEnd);
		this.resizeObserver.disconnect();
	}

	handleDragStart = (e: MouseEvent) => {
		this.dragPoint = new Offset({ x: e.x, y: e.y });
		this.view.style.cursor = 'grabbing';
	};

	handleDragMove = (e: MouseEvent) => {
		if (this.dragPoint == null) return;
		const scale = this.controller.getScale();
		const current = new Offset({ x: e.x, y: e.y });
		const movement = current.minus(this.dragPoint).multiply(1 / scale);
		this.dragPoint = current;
		this.translateViewport(movement);
	};

	handleDragEnd = () => {
		this.dragPoint = null;
		this.view.style.cursor = 'default';
	};

	translateViewport({ x, y }: { x: number; y: number }) {
		this.viedBox.x -= x;
		this.viedBox.y -= y;
		this.notifyViewportChange();
	}

	handleResizeView = ([entry]: ResizeObserverEntry[]) => {
		this.viedBox.width = entry.contentRect.width / this.controller.getScale();
		this.viedBox.height = entry.contentRect.height / this.controller.getScale();
		this.notifyViewportChange();
	};

	handleWheel = (e: WheelEvent) => {
		e.preventDefault();
		/*
				mac은 window와 달리 wheel 방향이 반대이다.
				그러나 터치패드로 확대/축소를 할 때는 mac과 window의 방향이 같다. 
				터치패드 확대를 기준으로 하면, deltaY에 음수를 곱해야 zoom 동작이 제대로 동작한다.
				때문에 이 위젯에서는 마우스 휠 동작은 mac과 window가 각자의 native 방향과 반대로 동작하게 된다.
			*/

		const reversedDeltaY = e.deltaY * -1;
		const reversedDeltaX = e.deltaX * -1;

		if (!e.ctrlKey && !e.metaKey) {
			this.translateViewport({
				x: reversedDeltaX,
				y: reversedDeltaY
			});
			this.notifyViewportChange();
			return;
		}
		this.zoom({ x: e.offsetX, y: e.offsetY, deltaScale: reversedDeltaY });
	};

	private zoom({ x, y, deltaScale }: { x: number; y: number; deltaScale: number }) {
		const oldScale = this.controller.getScale();
		const newScale = clamp(oldScale + deltaScale / SCALE_SENSITIVITY, 0.5, 2);
		const newOrigin = new Offset({
			x: x / newScale,
			y: y / newScale
		});

		const s = newScale / oldScale;
		const r = 1 - 1 / s;

		this.viedBox.width /= s;
		this.viedBox.height /= s;
		this.viedBox.x += this.scaleOrigin.x * r;
		this.viedBox.y += this.scaleOrigin.y * r;

		this.scaleOrigin = newOrigin;
		this.controller.changeScale(newScale);
		this.notifyViewportChange();
	}

	private notifyViewportChange() {
		const scale = this.controller.getScale();
		this.element.renderContext.setViewport({
			translation: { x: -this.viedBox.x, y: -this.viedBox.y },
			scale
		});

		this.controller.changeRootRect({
			left: -this.viedBox.x,
			top: -this.viedBox.y,
			width: this.viedBox.width * scale ** 2,
			height: this.viedBox.height * scale ** 2
		});
	}

	override build() {
		return Container({
			width: Infinity,
			height: Infinity,
			child: ConstraintsTransformBox({
				alignment: Alignment.topLeft,
				constraintsTransform: ConstraintsTransformBox.maxUnconstrained,
				child: this.widget.child
			})
		});
	}
}

export default classToFunction(InteractiveViewport);
