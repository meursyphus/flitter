import type { Project } from '../type';
import { StatelessWidget } from '@meursyphus/flitter';
import EventManagerProvider from './Provider/EventManagerProvider';
import { classToFunction } from './utils';
import DiagramRoot from './Root';
import DiagramControllerProvider from './Provider/DiagramControllerProvider';
import { EventManager } from '../event';

type Subscribe = (callback: (project: Project) => void) => () => void;

class Diagram extends StatelessWidget {
	project: Project;
	subscribe: Subscribe;
	eventManager!: EventManager;

	constructor({ project, subscribe }: { project: Project; subscribe: Subscribe }) {
		super();
		this.project = project;
		this.subscribe = subscribe;
		this.eventManager = new EventManager();
	}
	override build() {
		/**
		 * Provider must be placed in stateless wid
		 * It is flutterjs's bug. If you place it in stateful widget, the child widget is not updated when 'setState' is called.
		 */
		return EventManagerProvider({
			child: DiagramControllerProvider({
				child: DiagramRoot({ project: this.project, subscribe: this.subscribe })
			})
		});
	}
}

export default classToFunction(Diagram);
