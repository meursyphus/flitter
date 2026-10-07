import { describe, it, expect, vi } from 'vitest';
import {
	BuildOwner,
	EdgeInsets,
	SliverPadding,
	Constraints,
	Size,
	Offset,
	HitTestResult,
	RenderObject,
	RenderViewport,
	RenderSliverList,
	ScrollController,
	SliverConstraints,
	SliverGeometry,
	SliverList,
	SliverFixedExtentList,
	Viewport,
	ListView,
	State,
	StatefulWidget,
	SizedBox,
	type Element,
	type Widget
} from 'flitter-core';
import RenderObjectToWidgetAdapter from '../../../packages/core/src/widget/RenderObjectToWidgetAdapter';
import RenderObjectWidget from '../../../packages/core/src/widget/RenderObjectWidget';
import { SliverListElement } from '../../../packages/core/src/component/SliverList';

function createTree(widget: Widget, width = 200, height = 100) {
	const owner = new BuildOwner({ onNeedVisualUpdate() {} });
	const pipeline = {
		structureEpoch: 0,
		needsLayoutRenderObjects: [] as RenderObject[],
		bumpStructureEpoch() {
			this.structureEpoch++;
		},
		requestVisualUpdate() {},
		markNeedsPaint() {},
		markNeedsCompositingBitsUpdate() {},
		markNeedsPaintTransformUpdate() {},
		didChangePaintTransform() {},
		notifyZOrderChanged() {},
		disposeRenderObject() {},
		hitTestDispatcher: { setRenderView() {} }
	};
	const root = new RenderObjectToWidgetAdapter({
		app: widget,
		buildOwner: owner,
		renderPipeline: pipeline as any,
		scheduler: {} as any
	}).createElement();
	root.mount();
	root.renderObject.layout(Constraints.tight({ width, height }));
	const flush = () => {
		owner.flushBuild();
		let guard = 0;
		while (pipeline.needsLayoutRenderObjects.length && guard++ < 10) {
			const pending = pipeline.needsLayoutRenderObjects.splice(0).sort((a, b) => a.depth - b.depth);
			pending.forEach((render) => {
				if (render.ownerElement.isActive && render.needsLayout) render.layoutWithoutResize();
			});
		}
		owner.finalizeTree();
		expect(guard).toBeLessThan(10);
	};
	flush();
	const elements: Element[] = [];
	const visit = (element: Element) => {
		elements.push(element);
		element.visitChildren(visit);
	};
	visit(root);
	return {
		root,
		owner,
		flush,
		elements,
		lists: elements.filter((e) => e instanceof SliverListElement) as SliverListElement[],
		viewport: elements
			.map((e) => e.renderObject)
			.find((r) => r instanceof RenderViewport) as RenderViewport
	};
}

class MeasuredBox extends RenderObjectWidget {
	constructor(
		readonly extent: number,
		readonly onLayout: () => void = () => {}
	) {
		super({ children: [] });
	}
	createRenderObject() {
		const widget = this;
		return new (class extends RenderObject {
			constructor() {
				super({ isPainter: false });
			}
			protected preformLayout() {
				widget.onLayout();
				this.size = this.constraints.constrain(
					new Size({ width: widget.extent, height: widget.extent })
				);
			}
			override hitTestSelf() {
				return true;
			}
		})();
	}
	updateRenderObject() {}
}

class StatefulRow extends StatefulWidget {
	constructor(
		readonly onDispose: () => void,
		readonly onActivate: () => void
	) {
		super();
	}
	createState() {
		return new RowState();
	}
}
class RowState extends State<StatefulRow> {
	value = 0;
	build() {
		return SizedBox({ height: 20 });
	}
	override activate() {
		this.widget.onActivate();
	}
	override dispose() {
		this.widget.onDispose();
	}
}

describe('sliver viewport virtualization', () => {
	it('builds and lays out only the fixed viewport and cache even for 10,000 rows and a distant jump', () => {
		const built: number[] = [];
		const layouts = vi.fn();
		const controller = new ScrollController();
		const env = createTree(
			Viewport({
				controller,
				cacheExtent: 20,
				slivers: [
					SliverFixedExtentList({
						itemCount: 10000,
						itemExtent: 20,
						keepAliveCount: 2,
						itemBuilder: (index) => {
							built.push(index);
							return new MeasuredBox(20, layouts);
						}
					})
				]
			})
		);
		expect(built).toEqual([0, 1, 2, 3, 4, 5]);
		expect(layouts).toHaveBeenCalledTimes(6);
		expect(controller.maxScrollExtent).toBe(199900);
		controller.jumpTo(100000);
		env.flush();
		expect(env.lists[0].activeIndices).toEqual([4999, 5000, 5001, 5002, 5003, 5004, 5005]);
		expect(built).toHaveLength(13);
		expect(layouts).toHaveBeenCalledTimes(13);
		expect(env.lists[0].keptAliveChildCount).toBe(2);
		env.root.unmount();
	});

	it('deactivates a bounded number of offscreen states and reuses them after finalizeTree', () => {
		const disposed = vi.fn();
		const activated = vi.fn();
		const controller = new ScrollController();
		const env = createTree(
			Viewport({
				controller,
				cacheExtent: 0,
				slivers: [
					SliverFixedExtentList({
						itemCount: 1000,
						itemExtent: 20,
						keepAliveCount: 5,
						itemBuilder: () => new StatefulRow(disposed, activated)
					})
				]
			})
		);
		const original = env.lists[0].children[0] as any;
		original.state.setState(() => (original.state.value = 42));
		env.flush();
		controller.jumpTo(100);
		env.flush();
		expect(original.isActive).toBe(false);
		expect(disposed).toHaveBeenCalledTimes(0);
		controller.jumpTo(0);
		env.flush();
		expect(env.lists[0].children[0] === original).toBe(true);
		expect(original.state.value).toBe(42);
		expect(activated).toHaveBeenCalledTimes(5);
		controller.jumpTo(1000);
		env.flush();
		expect(env.lists[0].keptAliveChildCount).toBe(5);
		expect(disposed).toHaveBeenCalledTimes(5);
		env.root.unmount();
		expect(disposed).toHaveBeenCalledTimes(15);
	});

	it('composes slivers with decreasing remaining paint and cache extents', () => {
		const controller = new ScrollController();
		const builders = [
			vi.fn(() => new MeasuredBox(20)),
			vi.fn(() => new MeasuredBox(20)),
			vi.fn(() => new MeasuredBox(20))
		];
		const env = createTree(
			Viewport({
				controller,
				cacheExtent: 0,
				slivers: builders.map((itemBuilder, index) =>
					SliverFixedExtentList({ itemCount: index === 0 ? 2 : 100, itemExtent: 20, itemBuilder })
				)
			})
		);
		const renders = env.lists.map((e) => e.renderObject as RenderSliverList);
		expect(renders.map((r) => r.sliverConstraints.remainingPaintExtent)).toEqual([100, 60, 0]);
		expect(renders.map((r) => r.geometry.paintExtent)).toEqual([40, 60, 0]);
		expect(builders.map((b) => b.mock.calls.length)).toEqual([2, 3, 0]);
		controller.jumpTo(30);
		env.flush();
		expect(renders.map((r) => r.geometry.paintExtent)).toEqual([10, 90, 0]);
		expect(renders[1].offset.y).toBe(10);
		env.root.unmount();
	});

	it('measures variable rows, reuses known offsets and releases rows traversed by a jump', () => {
		const built = vi.fn((index: number) => new MeasuredBox(index % 2 === 0 ? 10 : 30));
		const controller = new ScrollController();
		const env = createTree(
			Viewport({
				controller,
				cacheExtent: 0,
				slivers: [SliverList({ itemCount: 1000, itemBuilder: built, keepAliveCount: 3 })]
			})
		);
		expect(env.lists[0].activeIndices).toEqual([0, 1, 2, 3, 4, 5]);
		controller.jumpTo(1000);
		env.flush();
		expect(env.lists[0].activeIndices).toEqual([50, 51, 52, 53, 54, 55]);
		expect(env.lists[0].children.length).toBe(6);
		expect(env.lists[0].keptAliveChildCount).toBe(3);
		controller.jumpTo(40);
		env.flush();
		expect(env.lists[0].activeIndices).toEqual([2, 3, 4, 5, 6, 7]);
		env.root.unmount();
	});

	it('positions horizontal rows and hit tests in viewport coordinates, excluding clipped children', () => {
		const controller = new ScrollController({ initialScrollOffset: 15 });
		const env = createTree(
			Viewport({
				controller,
				scrollDirection: 'horizontal',
				cacheExtent: 20,
				slivers: [
					SliverFixedExtentList({
						itemCount: 100,
						itemExtent: 20,
						itemBuilder: () => new MeasuredBox(20)
					})
				]
			}),
			100,
			40
		);
		const list = env.lists[0];
		expect(list.children[0].renderObject.offset.x).toBe(-15);
		const result = new HitTestResult();
		expect(env.viewport.hitTest(result, new Offset({ x: 6, y: 5 }))).toBe(true);
		expect(result.path.some((entry) => entry.target === list.children[1].renderObject)).toBe(true);
		expect(env.viewport.hitTest(new HitTestResult(), new Offset({ x: 101, y: 5 }))).toBe(false);
		env.root.unmount();
	});

	it('clamps the scroll window after data shrink and rebuilds active row data', () => {
		const controller = new ScrollController({ initialScrollOffset: 1000 });
		const make = (count: number) =>
			Viewport({
				controller,
				cacheExtent: 0,
				slivers: [
					SliverFixedExtentList({
						itemCount: count,
						itemExtent: 20,
						itemBuilder: () => new MeasuredBox(20)
					})
				]
			});
		const env = createTree(make(100));
		env.root.updateChildren([make(2)]);
		env.flush();
		expect(controller.offset).toBe(0);
		expect(controller.maxScrollExtent).toBe(0);
		expect(env.lists[0].activeIndices).toEqual([0, 1]);
		expect(env.lists[0].keptAliveChildCount).toBe(0);
		env.root.unmount();
	});

	it('does not build cache rows when the viewport main extent is zero', () => {
		const builder = vi.fn(() => SizedBox({}));
		const env = createTree(
			SizedBox({
				width: 200,
				height: 0,
				child: Viewport({
					controller: new ScrollController(),
					slivers: [
						SliverFixedExtentList({ itemCount: 10000, itemExtent: 20, itemBuilder: builder })
					]
				})
			})
		);
		expect(builder).not.toHaveBeenCalled();
		env.root.unmount();
	});

	it('supports empty, zero-size and eager ListViews and validates invalid configuration', () => {
		const controller = new ScrollController();
		const empty = createTree(
			ListView({
				controller,
				itemCount: 0,
				itemBuilder: () => {
					throw new Error('must not build');
				}
			})
		);
		expect(controller.maxScrollExtent).toBe(0);
		empty.root.unmount();
		const eager = createTree(
			ListView({ children: [SizedBox({ height: 20 }), SizedBox({ height: 30 })] })
		);
		expect(eager.lists[0].activeIndices).toEqual([0, 1]);
		eager.root.unmount();
		expect(() => SliverList({ itemCount: -1, itemBuilder: () => SizedBox({}) })).toThrow();
		expect(() =>
			SliverFixedExtentList({ itemCount: 1, itemExtent: 0, itemBuilder: () => SizedBox({}) })
		).toThrow();
		expect(() => new SliverGeometry({ paintExtent: 20, maxPaintExtent: 10 })).toThrow();
		expect(
			new SliverConstraints({ crossAxisExtent: 100, viewportMainAxisExtent: 100 }).equals(
				new SliverConstraints({
					crossAxisExtent: 100,
					viewportMainAxisExtent: 100,
					scrollOffset: 20
				})
			)
		).toBe(false);
	});
});

describe('ListView padding and reverse', () => {
	for (const horizontal of [false, true]) {
		for (const reverse of [false, true]) {
			it(`scrolls padding with content and reverses row positions (horizontal=${horizontal}, reverse=${reverse})`, () => {
				const controller = new ScrollController();
				const padding = horizontal
					? EdgeInsets.only({ left: 10, right: 30, top: 5, bottom: 5 })
					: EdgeInsets.only({ top: 10, bottom: 30, left: 5, right: 5 });
				const env = createTree(
					ListView.builder({
						controller,
						scrollDirection: horizontal ? 'horizontal' : 'vertical',
						reverse,
						padding,
						cacheExtent: 0,
						itemExtent: 20,
						itemCount: 100,
						itemBuilder: () => new MeasuredBox(20)
					}),
					horizontal ? 100 : 40,
					horizontal ? 40 : 100
				);
				expect(controller.maxScrollExtent).toBe(1940);
				const first = env.lists[0].children[0].renderObject;
				const origin = first.localToGlobal();
				expect(horizontal ? origin.x : origin.y).toBe(reverse ? 50 : 10);
				expect(horizontal ? first.size.height : first.size.width).toBe(30);
				controller.jumpTo(reverse ? 30 : 10);
				env.flush();
				const withoutPadding = env.lists[0].children[0].renderObject.localToGlobal();
				expect(horizontal ? withoutPadding.x : withoutPadding.y).toBe(reverse ? 80 : 0);
				controller.jumpTo(controller.maxScrollExtent);
				env.flush();
				expect(env.lists[0].activeIndices.at(-1)).toBe(99);
				const last = env.lists[0].children.at(-1)!.renderObject.localToGlobal();
				expect(horizontal ? last.x : last.y).toBe(reverse ? 10 : 50);
				env.root.unmount();
			});
		}
	}
	it('reverses multiple sliver sections without overlapping their contents', () => {
		const controller = new ScrollController();
		const env = createTree(
			Viewport({
				controller,
				reverse: true,
				cacheExtent: 0,
				slivers: [
					SliverFixedExtentList({
						itemCount: 2,
						itemExtent: 20,
						itemBuilder: () => new MeasuredBox(20)
					}),
					SliverPadding({
						padding: EdgeInsets.only({ bottom: 10 }),
						sliver: SliverFixedExtentList({
							itemCount: 10,
							itemExtent: 20,
							itemBuilder: () => new MeasuredBox(20)
						})
					})
				]
			})
		);
		expect(env.lists[0].children[0].renderObject.localToGlobal().y).toBe(80);
		expect(env.lists[1].children[0].renderObject.localToGlobal().y).toBe(30);
		expect(controller.maxScrollExtent).toBe(150);
		env.root.unmount();
	});
});

describe('ScrollController', () => {
	it('preserves initial offsets, clamps to metrics and notifies only on changes', async () => {
		const controller = new ScrollController({ initialScrollOffset: 1000 });
		const listener = vi.fn();
		controller.addListener(listener);
		expect(controller.offset).toBe(1000);
		expect(controller.updateMetrics({ maxScrollExtent: 100, viewportDimension: 50 })).toBe(true);
		expect(controller.offset).toBe(100);
		controller.jumpTo(200);
		expect(listener).toHaveBeenCalledTimes(1);
		controller.jumpTo(-1);
		expect(controller.offset).toBe(0);
		await controller.animateTo(50, { duration: 0 });
		expect(controller.offset).toBe(50);
		expect(controller.isAnimating).toBe(false);
		controller.dispose();
		expect(() => controller.jumpTo(0)).toThrow('disposed');
	});
});
