import { describe, expect, it } from "vitest";
import {
	BuildOwner,
	BuildContext,
	GlobalKey,
	Provider,
	RenderFrameDispatcher,
	Scheduler,
	State,
	StatefulWidget,
	StatelessWidget,
	type Widget,
	Widget as BaseWidget,
	Element,
} from "flitter-core";

class HostElement extends Element {
	child?: Element;

	visitChildren(visitor: (child: Element) => void): void {
		if (this.child) {
			visitor(this.child);
		}
	}

	protected performRebuild(): void {}

	forgetChild(child: Element): void {
		if (this.child === child) {
			this.child = undefined;
		}
	}
}

class LeafWidget extends BaseWidget {
	createElement(): Element {
		return new LeafElement(this);
	}
}

class LeafElement extends Element {
	visitChildren(_visitor: (child: Element) => void): void {}

	protected performRebuild(): void {}
}

class CountingWidget extends BaseWidget {
	createElement(): Element {
		return new CountingElement(this);
	}
}

class CountingElement extends Element {
	updateCount = 0;

	override update(newWidget: BaseWidget): void {
		this.updateCount += 1;
		super.update(newWidget);
	}

	visitChildren(_visitor: (child: Element) => void): void {}

	protected performRebuild(): void {}
}

class ConsumerWidget extends StatelessWidget {
	constructor(private readonly onBuild: (value: number) => void) {
		super();
	}

	override build(context: BuildContext): Widget {
		this.onBuild(Provider.of(KEY, context));
		return new LeafWidget();
	}
}

class ReactiveCounterWidget extends StatefulWidget {
	constructor(key?: GlobalKey) {
		super(key);
	}

	override createState(): State<ReactiveCounterWidget> {
		return new ReactiveCounterState();
	}
}

class ReactiveCounterState extends State<ReactiveCounterWidget> {
	buildCount = 0;

	override build(_context: BuildContext): Widget {
		this.buildCount += 1;
		return new LeafWidget();
	}
}

class DirtyElement extends Element {
	rebuildCount = 0;
	onRebuild?: () => void;

	visitChildren(_visitor: (child: Element) => void): void {}

	protected performRebuild(): void {
		this.rebuildCount += 1;
		this.onRebuild?.();
	}
}

const KEY = Symbol("provider-key");

const createEnvironment = () => {
	const buildOwner = new BuildOwner({
		onNeedVisualUpdate: () => {},
	});
	const scheduler = new Scheduler({
		renderFrameDispatcher: new RenderFrameDispatcher(),
	});
	const root = new HostElement(new LeafWidget());
	root.buildOwner = buildOwner;
	root.scheduler = scheduler;
	root.mount();
	return { buildOwner, root };
};

describe("build phase optimization", () => {
	it("skips element updates when the widget identity is unchanged", () => {
		const { root } = createEnvironment();
		const childWidget = new CountingWidget();

		const child = root.updateChild(undefined, childWidget) as CountingElement;
		root.child = child;
		root.child = root.updateChild(root.child, childWidget) ?? undefined;

		expect(child.updateCount).toBe(0);
		expect(root.child).toBe(child);
	});

	it("notifies inherited dependents only when provider data changes", () => {
		const { buildOwner, root } = createEnvironment();
		const seenValues: number[] = [];
		const consumer = new ConsumerWidget((value) => {
			seenValues.push(value);
		});

		root.child =
			root.updateChild(
				undefined,
				Provider({
					child: consumer,
					providerKey: KEY,
					value: 1,
				}),
			) ?? undefined;

		root.child =
			root.updateChild(
				root.child,
				Provider({
					child: consumer,
					providerKey: KEY,
					value: 1,
				}),
			) ?? undefined;

		buildOwner.flushBuild();
		expect(seenValues).toEqual([1]);

		root.child =
			root.updateChild(
				root.child,
				Provider({
					child: consumer,
					providerKey: KEY,
					value: 2,
				}),
			) ?? undefined;

		buildOwner.flushBuild();
		expect(seenValues).toEqual([1, 2]);
	});

	it("reactivates inactive global-key elements without losing state", () => {
		const { root } = createEnvironment();
		const otherRoot = new HostElement(new LeafWidget());
		otherRoot.buildOwner = root.buildOwner;
		otherRoot.scheduler = root.scheduler;
		otherRoot.mount();

		const key = new GlobalKey();
		root.child =
			root.updateChild(undefined, new ReactiveCounterWidget(key)) ?? undefined;

		const originalElement = root.child!;
		const originalState = (originalElement as any).state as ReactiveCounterState;

		root.child = root.updateChild(root.child, null) ?? undefined;
		otherRoot.child =
			otherRoot.updateChild(undefined, new ReactiveCounterWidget(key)) ?? undefined;

		const reactivatedElement = otherRoot.child!;
		const reactivatedState = (reactivatedElement as any)
			.state as ReactiveCounterState;

		expect(reactivatedElement).toBe(originalElement);
		expect(reactivatedState).toBe(originalState);
		expect(reactivatedState.buildCount).toBeGreaterThan(0);
	});

	it("rebuilds elements added to the dirty list during the current flush", () => {
		const { buildOwner, root } = createEnvironment();
		const parent = new DirtyElement(new LeafWidget());
		parent.buildOwner = root.buildOwner;
		parent.scheduler = root.scheduler;
		parent.mount(root);
		parent.dirty = false;

		const child = new DirtyElement(new LeafWidget());
		child.buildOwner = root.buildOwner;
		child.scheduler = root.scheduler;
		child.mount(parent);
		child.dirty = false;

		parent.onRebuild = () => {
			child.markNeedsBuild();
		};

		parent.markNeedsBuild();
		buildOwner.flushBuild();

		expect(parent.rebuildCount).toBe(1);
		expect(child.rebuildCount).toBe(1);
	});
});
