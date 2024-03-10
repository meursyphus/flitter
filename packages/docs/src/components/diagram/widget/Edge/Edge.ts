import {
	StatefulWidget,
	State,
	BuildContext,
	CustomPaint,
	Path,
	Rect,
	GlobalKey
} from '@moonmoonbrothers/flutterjs';
import { classToFunction } from '../utils';
import drawEdge from './drawEdge';
import EventManagerProvider from '../Provider/EventManagerProvider';
import { ActiveRelationEvent, EventManager, FieldLayoutChangeEvent } from '../../event';
import DiagramControllerProvider from '../Provider/DiagramControllerProvider';
import type { DiagramController } from '$lib/components/diagram/controller';
import type { FieldId } from '$lib/components/diagram/type';

type Vertex<FIELD_ID = FieldId> = {
	id: FIELD_ID;
	relation: '*' | '1';
};

class Edge<FIELD_ID extends number = number> extends StatefulWidget {
	fields: Record<FIELD_ID, GlobalKey>;
	from: Vertex<FIELD_ID>;
	to: Vertex<FIELD_ID>;
	constructor(props: {
		from: Vertex<FIELD_ID>;
		to: Vertex<FIELD_ID>;
		fields: Record<FIELD_ID, GlobalKey>;
	}) {
		super();
		this.from = props.from;
		this.to = props.to;
		this.fields = props.fields;
	}

	createState() {
		return new EdgeState();
	}
}

class EdgeState extends State<Edge> {
	from?: Rect;
	to?: Rect;
	active = false;
	eventManager!: EventManager;
	controller!: DiagramController;
	override initState(context: BuildContext) {
		const eventManager = EventManagerProvider.of(context);
		this.eventManager = eventManager;
		this.controller = DiagramControllerProvider.of(context);

		eventManager.addEventListener(FieldLayoutChangeEvent.type, this.handlePositionChangeEvent);
		eventManager.addEventListener(ActiveRelationEvent.type, this.handleActiveRelationEvent);

		context.scheduler.addPostFrameCallbacks(() => {
			this.setState(() => {
				const fields = this.widget.fields;
				this.from = this.controller.getRect(fields[this.widget.from.id]);
				this.to = this.controller.getRect(fields[this.widget.to.id]);
			});
		});
	}

	dispose(): void {
		super.dispose();
		this.eventManager.removeEventListener(ActiveRelationEvent.type, this.handleActiveRelationEvent);
		this.eventManager.removeEventListener(
			FieldLayoutChangeEvent.type,
			this.handlePositionChangeEvent
		);
	}
	handlePositionChangeEvent = (e: FieldLayoutChangeEvent) => {
		if (e.id === this.widget.from.id) {
			this.didChangePosition('from', e.key);
		} else if (e.id === this.widget.to.id) {
			this.didChangePosition('to', e.key);
		}
	};

	handleActiveRelationEvent = (e: ActiveRelationEvent) => {
		if (e.field.from !== this.widget.from.id || e.field.to !== this.widget.to.id) return;
		this.setState(() => {
			this.active = e.active;
		});
	};

	didChangePosition(type: 'to' | 'from', key: GlobalKey) {
		this.element.scheduler.addPostFrameCallbacks(() => {
			this.setState(() => {
				this[type] = this.controller.getRect(key);
			});
		});
	}

	override build() {
		return CustomPaint({
			painter: {
				dependencies: { active: this.active, from: this.from, to: this.to },
				shouldRepaint: (old) => {
					const { dependencies } = old;
					const { from, to, active } = dependencies as { from: Rect; to: Rect; active: boolean };
					if (from == null || to == null) return true;
					const result =
						to.right !== this.to?.right ||
						to.left !== this.to?.left ||
						to.top !== this.to?.top ||
						to.bottom !== this.to?.bottom ||
						from.right !== this.from?.right ||
						from.left !== this.from?.left ||
						from.top !== this.from?.top ||
						from.bottom !== this.from?.bottom ||
						active !== this.active;

					return result;
				},
				createDefaultSvgEl: (context) => ({ path: context.createSvgEl('path') }),
				paint: ({ path }) => {
					const painter = new Path();
					if (this.from == null || this.to == null) return;
					drawEdge({
						path: painter,
						fromField: {
							rect: this.from,
							relation: this.widget.from.relation
						},
						toField: {
							rect: this.to,
							relation: this.widget.to.relation
						}
					});
					path.setAttribute('stroke-width', this.active ? '2' : '1');
					path.setAttribute('stroke', this.active ? 'black' : 'gray');
					path.setAttribute('d', painter.getD());
				}
			}
		});
	}
}

export default classToFunction(Edge);
