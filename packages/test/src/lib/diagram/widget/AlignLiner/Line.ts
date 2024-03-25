import { CustomPaint, Element, State, StatefulWidget } from '@meursyphus/flitter';
import type { Line as LineProps } from './type';
import type { DiagramController } from '../../controller';
import { DiagramControllerProvider } from '../Provider';
import { classToFunction } from '../utils';

class Line extends StatefulWidget {
	line: LineProps;
	constructor({ line, key }: { line: LineProps; key?: unknown }) {
		super(key);
		this.line = line;
	}

	createState(): State<StatefulWidget> {
		return new LineState();
	}
}

class LineState extends State<Line> {
	controller!: DiagramController;
	initState(context: Element): void {
		super.initState(context);
		this.controller = DiagramControllerProvider.of(context);
	}

	resolveProps(props: LineProps): { x1: number; x2: number; y1: number; y2: number } {
		let result: { x1: number; x2: number; y1: number; y2: number };
		const rootRect = this.controller.getRootRect();
		const canvasRect = this.controller.getCanvasRect();
		const scale = this.controller.getScale();
		if (props.type === 'horizontal') {
			const { y } = props;
			result = {
				x1: (canvasRect.left - rootRect.left) / scale + rootRect.left,
				x2: (rootRect.width + canvasRect.right - rootRect.right) / scale + rootRect.left,
				y1: y,
				y2: y
			};
		} else {
			const { x } = props;
			result = {
				x1: x,
				x2: x,
				y1: (canvasRect.top - rootRect.top) / scale + rootRect.top,
				y2: (rootRect.height + canvasRect.bottom - rootRect.bottom) / scale + rootRect.top
			};
		}
		return result;
	}

	override build() {
		return CustomPaint({
			painter: {
				shouldRepaint: () => true,
				createDefaultSvgEl: (paintContext) => ({
					line: paintContext.createSvgEl('line')
				}),
				paint: ({ line }) => {
					const { x1, y1, x2, y2 } = this.resolveProps(this.widget.line);
					line.setAttribute('x1', `${x1}`);
					line.setAttribute('y1', `${y1}`);
					line.setAttribute('x2', `${x2}`);
					line.setAttribute('y2', `${y2}`);

					line.setAttribute('stroke', 'black');
					line.setAttribute('stroke-width', '1');
					line.setAttribute('stroke-dasharray', '5,5');
				}
			}
		});
	}
}

export default classToFunction(Line);
