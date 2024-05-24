import {
	Stack,
	State,
	StatefulWidget,
	StackFit,
	BuildContext,
	Positioned,
	Alignment
} from '@meursyphus/flitter';
import InitialNodes from './Node/InitialNodes';
import InteractiveViewport from './InteractiveViewport';
import type { Project } from '../type';
import { classToFunction } from './utils';
import DiagramControllerProvider from './Provider/DiagramControllerProvider';
import LegacyNodes from './Node/LegacyNodes';
import Edges from './Edge/RefDrawer';
import type { DiagramController } from '../controller';
import AlignLiner from './AlignLiner/AlignLiner';

type Subscribe = (callback: (project: Project) => void) => () => void;

class DiagramRoot extends StatefulWidget {
	project: Project;
	subscribe: Subscribe;

	constructor({ project, subscribe }: { project: Project; subscribe: Subscribe }) {
		super();
		this.project = project;
		this.subscribe = subscribe;
	}

	createState(): State<StatefulWidget> {
		return new DiagramState();
	}
}

class DiagramState extends State<DiagramRoot> {
	unsubscribe!: () => void;
	/**
	 * This is temporary fix to avoid setState on unmounted component.
	 * It causes error on finding value provided by Provider (that is located in Root Tree)
	 */
	mounted: boolean = false;
	controller!: DiagramController;

	override initState(context: BuildContext) {
		this.controller = DiagramControllerProvider.of(context);
		this.controller.updateProject(this.widget.project);
		this.unsubscribe = this.widget.subscribe((update) => {
			if (!this.mounted) return;
			this.setState(() => {
				this.controller.updateProject(update);
			});
		});
		this.mounted = true;
	}

	override dispose(): void {
		this.unsubscribe();
	}

	override build(context: BuildContext) {
		const controller = DiagramControllerProvider.of(context);
		const rootKey = controller.diagramRootGlobalKey;
		return InteractiveViewport({
			child: Stack({
				key: rootKey,
				fit: StackFit.loose,
				alignment: Alignment.center,
				children: [
					Positioned.fill({
						child: AlignLiner()
					}),
					Positioned.fill({
						child: Edges()
					}),
					InitialNodes(),
					Positioned.fill({
						child: LegacyNodes()
					})
				]
			})
		});
	}
}

export default classToFunction(DiagramRoot);
