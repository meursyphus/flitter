import {
	BuildContext,
	GestureDetector,
	GlobalKey,
	LayoutBuilder,
	SizedBox,
	Stack,
	StackFit,
	State,
	StatefulWidget,
	StatelessWidget,
	type Widget,
} from "flitter-core";

type CartesianCustom = {
	title: (args: undefined, context: any) => Widget;
	xAxis: (args: { line: Widget; labels: Widget[]; tick: Widget }, context: any) => Widget;
	yAxis: (args: { line: Widget; labels: Widget[]; tick: Widget }, context: any) => Widget;
	xAxisLabel: (args: { name: string; index: number }, context: any) => Widget;
	yAxisLabel: (args: { name: string; index: number }, context: any) => Widget;
	xAxisTick: (args: undefined, context: any) => Widget;
	yAxisTick: (args: undefined, context: any) => Widget;
	xAxisLine: (args: undefined, context: any) => Widget;
	yAxisLine: (args: undefined, context: any) => Widget;
	axisCorner: (args: undefined, context: any) => Widget;
	grid: (args: { xLine: Widget; yLine: Widget }, context: any) => Widget;
	gridXLine: (args: undefined, context: any) => Widget;
	gridYLine: (args: undefined, context: any) => Widget;
};

export type CartesianScale = {
	min: number;
	max: number;
	step: number;
};

export type CartesianRect = {
	x: number;
	y: number;
	width: number;
	height: number;
};

type RenderObjectLike = {
	offset: {
		x: number;
		y: number;
	};
	size: {
		width: number;
		height: number;
	};
	parent?: RenderObjectLike;
};

export type CartesianLegend = {
	name: string;
	index: number;
	onClick?: () => void;
};

export type CartesianScaffoldContext = {
	custom: CartesianCustom;
	setSize: (width: number, height: number) => void;
};

export type CartesianTooltipBehavior<
	TContext extends CartesianScaffoldContext,
	THovered,
> = {
	resolveHovered: (ctx: TContext, overlayKey: GlobalKey) => THovered | null;
	buildTooltip: (ctx: TContext, hovered: THovered) => Widget | null;
	buildTooltipArea: (
		ctx: TContext,
		args: { tooltip: Widget | null; hovered: THovered | null },
	) => Widget;
};

export type CartesianScaffoldBehavior<
	TContext extends CartesianScaffoldContext,
	THovered = never,
> = {
	of: (context: BuildContext) => TContext;
	buildLayout: (
		ctx: TContext,
		args: { title: Widget; plot: Widget; legends: Widget[] },
	) => Widget;
	buildPlot: (
		ctx: TContext,
		args: {
			xAxis: Widget;
			yAxis: Widget;
			dataView: Widget;
			grid: Widget;
			axisCorner: Widget;
			tooltipArea: Widget | null;
		},
	) => Widget;
	getLegends?: (ctx: TContext) => CartesianLegend[];
	buildLegend?: (ctx: TContext, legend: CartesianLegend) => Widget;
	getXAxisLabels: (ctx: TContext) => string[];
	getYAxisLabels: (ctx: TContext) => string[];
	shouldRenderDataView?: (ctx: TContext) => boolean;
	buildDataView: (ctx: TContext) => Widget;
	tooltip?: CartesianTooltipBehavior<TContext, THovered>;
};

export function getScaleLabels(scale: CartesianScale | null | undefined): string[] {
	if (scale == null) return [];
	const labels = [];
	for (let index = 0; index <= (scale.max - scale.min) / scale.step; index++) {
		labels.push(scale.min + scale.step * index);
	}
	return labels.map((label) => label.toString());
}

export function resolveOverlayRect(
	overlayKey: GlobalKey,
	anchorKey: GlobalKey,
): CartesianRect | null {
	const overlayRenderObject = overlayKey.findCurrentContext()?.renderObject;
	const anchorRenderObject = anchorKey.findCurrentContext()?.renderObject;
	if (overlayRenderObject == null || anchorRenderObject == null) return null;

	const anchorGlobal = resolveLayoutGlobalOffset(anchorRenderObject);
	const overlayGlobal = resolveLayoutGlobalOffset(overlayRenderObject);

	return {
		x: anchorGlobal.x - overlayGlobal.x,
		y: anchorGlobal.y - overlayGlobal.y,
		width: anchorRenderObject.size.width,
		height: anchorRenderObject.size.height,
	};
}

function resolveLayoutGlobalOffset(renderObject: RenderObjectLike): {
	x: number;
	y: number;
} {
	let x = 0;
	let y = 0;
	let current: RenderObjectLike | undefined = renderObject;

	while (current != null) {
		x += current.offset.x;
		y += current.offset.y;
		current = current.parent;
	}

	return { x, y };
}

export function createCartesianChart<
	TContext extends CartesianScaffoldContext,
	THovered = never,
>(behavior: CartesianScaffoldBehavior<TContext, THovered>): Widget {
	return new CartesianChart(behavior);
}

class CartesianChart<
	TContext extends CartesianScaffoldContext,
	THovered = never,
> extends StatelessWidget {
	behavior: CartesianScaffoldBehavior<TContext, THovered>;

	constructor(behavior: CartesianScaffoldBehavior<TContext, THovered>) {
		super();
		this.behavior = behavior;
	}

	override build(_: BuildContext): Widget {
		return new CartesianSizeTracker(this.behavior);
	}
}

class CartesianSizeTracker<
	TContext extends CartesianScaffoldContext,
	THovered = never,
> extends StatelessWidget {
	behavior: CartesianScaffoldBehavior<TContext, THovered>;

	constructor(behavior: CartesianScaffoldBehavior<TContext, THovered>) {
		super();
		this.behavior = behavior;
	}

	override build(context: BuildContext): Widget {
		const ctx = this.behavior.of(context);
		return LayoutBuilder({
			builder: (_ctx, constraints) => {
				ctx.setSize(constraints.maxWidth, constraints.maxHeight);
				return new CartesianLayout(this.behavior);
			},
		});
	}
}

class CartesianLayout<
	TContext extends CartesianScaffoldContext,
	THovered = never,
> extends StatelessWidget {
	behavior: CartesianScaffoldBehavior<TContext, THovered>;

	constructor(behavior: CartesianScaffoldBehavior<TContext, THovered>) {
		super();
		this.behavior = behavior;
	}

	override build(context: BuildContext): Widget {
		const ctx = this.behavior.of(context);
		const legends =
			this.behavior.getLegends?.(ctx).map(
				(legend) => new CartesianLegendWidget(this.behavior, legend),
			) ?? [];

		return this.behavior.buildLayout(ctx, {
			title: new CartesianTitle(this.behavior),
			plot: new CartesianPlot(this.behavior),
			legends,
		});
	}
}

class CartesianLegendWidget<
	TContext extends CartesianScaffoldContext,
	THovered = never,
> extends StatelessWidget {
	behavior: CartesianScaffoldBehavior<TContext, THovered>;
	legend: CartesianLegend;

	constructor(
		behavior: CartesianScaffoldBehavior<TContext, THovered>,
		legend: CartesianLegend,
	) {
		super();
		this.behavior = behavior;
		this.legend = legend;
	}

	override build(context: BuildContext): Widget {
		const ctx = this.behavior.of(context);
		const child =
			this.behavior.buildLegend?.(ctx, this.legend) ?? SizedBox.shrink();
		if (this.legend.onClick == null) return child;

		return GestureDetector({
			onClick: this.legend.onClick,
			child,
		});
	}
}

class CartesianTitle<
	TContext extends CartesianScaffoldContext,
	THovered = never,
> extends StatelessWidget {
	behavior: CartesianScaffoldBehavior<TContext, THovered>;

	constructor(behavior: CartesianScaffoldBehavior<TContext, THovered>) {
		super();
		this.behavior = behavior;
	}

	override build(context: BuildContext): Widget {
		const ctx = this.behavior.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

class CartesianAxis<
	TContext extends CartesianScaffoldContext,
	THovered = never,
> extends StatelessWidget {
	behavior: CartesianScaffoldBehavior<TContext, THovered>;
	kind: "x" | "y";

	constructor(
		behavior: CartesianScaffoldBehavior<TContext, THovered>,
		kind: "x" | "y",
	) {
		super();
		this.behavior = behavior;
		this.kind = kind;
	}

	override build(context: BuildContext): Widget {
		const ctx = this.behavior.of(context);
		const labels =
			(this.kind === "x"
				? this.behavior.getXAxisLabels(ctx)
				: this.behavior.getYAxisLabels(ctx)).map(
				(name, index) =>
					new CartesianAxisLabel(this.behavior, this.kind, { index, name }),
			);
		const tick = new CartesianAxisTick(this.behavior, this.kind);
		const line = new CartesianAxisLine(this.behavior, this.kind);

		return this.kind === "x"
			? ctx.custom.xAxis({ labels, tick, line }, ctx)
			: ctx.custom.yAxis({ labels, tick, line }, ctx);
	}
}

class CartesianAxisLabel<
	TContext extends CartesianScaffoldContext,
	THovered = never,
> extends StatelessWidget {
	behavior: CartesianScaffoldBehavior<TContext, THovered>;
	kind: "x" | "y";
	index: number;
	name: string;

	constructor(
		behavior: CartesianScaffoldBehavior<TContext, THovered>,
		kind: "x" | "y",
		{ index, name }: { index: number; name: string },
	) {
		super();
		this.behavior = behavior;
		this.kind = kind;
		this.index = index;
		this.name = name;
	}

	override build(context: BuildContext): Widget {
		const ctx = this.behavior.of(context);
		return this.kind === "x"
			? ctx.custom.xAxisLabel({ name: this.name, index: this.index }, ctx)
			: ctx.custom.yAxisLabel({ name: this.name, index: this.index }, ctx);
	}
}

class CartesianAxisTick<
	TContext extends CartesianScaffoldContext,
	THovered = never,
> extends StatelessWidget {
	behavior: CartesianScaffoldBehavior<TContext, THovered>;
	kind: "x" | "y";

	constructor(
		behavior: CartesianScaffoldBehavior<TContext, THovered>,
		kind: "x" | "y",
	) {
		super();
		this.behavior = behavior;
		this.kind = kind;
	}

	override build(context: BuildContext): Widget {
		const ctx = this.behavior.of(context);
		return this.kind === "x"
			? ctx.custom.xAxisTick(undefined, ctx)
			: ctx.custom.yAxisTick(undefined, ctx);
	}
}

class CartesianAxisLine<
	TContext extends CartesianScaffoldContext,
	THovered = never,
> extends StatelessWidget {
	behavior: CartesianScaffoldBehavior<TContext, THovered>;
	kind: "x" | "y";

	constructor(
		behavior: CartesianScaffoldBehavior<TContext, THovered>,
		kind: "x" | "y",
	) {
		super();
		this.behavior = behavior;
		this.kind = kind;
	}

	override build(context: BuildContext): Widget {
		const ctx = this.behavior.of(context);
		return this.kind === "x"
			? ctx.custom.xAxisLine(undefined, ctx)
			: ctx.custom.yAxisLine(undefined, ctx);
	}
}

class CartesianPlot<
	TContext extends CartesianScaffoldContext,
	THovered = never,
> extends StatelessWidget {
	behavior: CartesianScaffoldBehavior<TContext, THovered>;

	constructor(behavior: CartesianScaffoldBehavior<TContext, THovered>) {
		super();
		this.behavior = behavior;
	}

	override build(context: BuildContext): Widget {
		const ctx = this.behavior.of(context);
		const tooltipArea =
			this.behavior.tooltip == null
				? null
				: new CartesianTooltipOverlay(this.behavior);

		return this.behavior.buildPlot(ctx, {
			xAxis: new CartesianAxis(this.behavior, "x"),
			yAxis: new CartesianAxis(this.behavior, "y"),
			dataView:
				this.behavior.shouldRenderDataView?.(ctx) === false
					? SizedBox.shrink()
					: this.behavior.buildDataView(ctx),
			grid: new CartesianGrid(this.behavior),
			axisCorner: ctx.custom.axisCorner(undefined, ctx),
			tooltipArea,
		});
	}
}

class CartesianGrid<
	TContext extends CartesianScaffoldContext,
	THovered = never,
> extends StatelessWidget {
	behavior: CartesianScaffoldBehavior<TContext, THovered>;

	constructor(behavior: CartesianScaffoldBehavior<TContext, THovered>) {
		super();
		this.behavior = behavior;
	}

	override build(context: BuildContext): Widget {
		const ctx = this.behavior.of(context);
		return ctx.custom.grid(
			{
				xLine: new CartesianGridLine(this.behavior, "x"),
				yLine: new CartesianGridLine(this.behavior, "y"),
			},
			ctx,
		);
	}
}

class CartesianGridLine<
	TContext extends CartesianScaffoldContext,
	THovered = never,
> extends StatelessWidget {
	behavior: CartesianScaffoldBehavior<TContext, THovered>;
	kind: "x" | "y";

	constructor(
		behavior: CartesianScaffoldBehavior<TContext, THovered>,
		kind: "x" | "y",
	) {
		super();
		this.behavior = behavior;
		this.kind = kind;
	}

	override build(context: BuildContext): Widget {
		const ctx = this.behavior.of(context);
		return this.kind === "x"
			? ctx.custom.gridXLine(undefined, ctx)
			: ctx.custom.gridYLine(undefined, ctx);
	}
}

class CartesianTooltipOverlay<
	TContext extends CartesianScaffoldContext,
	THovered,
> extends StatefulWidget {
	behavior: CartesianScaffoldBehavior<TContext, THovered>;

	constructor(behavior: CartesianScaffoldBehavior<TContext, THovered>) {
		super();
		this.behavior = behavior;
	}

	createState() {
		return new CartesianTooltipOverlayState<TContext, THovered>();
	}
}

class CartesianTooltipOverlayState<
	TContext extends CartesianScaffoldContext,
	THovered,
> extends State<CartesianTooltipOverlay<TContext, THovered>> {
	overlayKey = new GlobalKey();
	scheduledHoveredRefresh = false;

	private getHoverSignature(hovered: THovered | null): string {
		if (hovered == null) return "null";

		try {
			return JSON.stringify(hovered);
		} catch {
			return `${hovered}`;
		}
	}

	private scheduleHoveredRefresh(
		ctx: TContext,
		tooltipBehavior: CartesianTooltipBehavior<TContext, THovered>,
		hovered: THovered | null,
	): void {
		if (this.scheduledHoveredRefresh) return;
		this.scheduledHoveredRefresh = true;
		const hoveredSignature = this.getHoverSignature(hovered);

		this.element.scheduler.addPostFrameCallbacks(() => {
			this.scheduledHoveredRefresh = false;
			if (!this.element.isActive) return;

			const refreshedHovered = tooltipBehavior.resolveHovered(
				ctx,
				this.overlayKey,
			);
			if (this.getHoverSignature(refreshedHovered) === hoveredSignature) {
				if (refreshedHovered == null) {
					return;
				}
				this.setState();
				return;
			}

			this.setState();
		});
	}

	override build(context: BuildContext): Widget {
		const { behavior } = this.widget;
		const tooltipBehavior = behavior.tooltip;
		if (tooltipBehavior == null) return SizedBox.shrink();

		const ctx = behavior.of(context);
		const hovered = tooltipBehavior.resolveHovered(ctx, this.overlayKey);
		this.scheduleHoveredRefresh(ctx, tooltipBehavior, hovered);
		const tooltip =
			hovered == null ? null : tooltipBehavior.buildTooltip(ctx, hovered);

		return Stack({
			fit: StackFit.expand,
			clipped: false,
			children: [
				SizedBox({ key: this.overlayKey, width: Infinity, height: Infinity }),
				tooltipBehavior.buildTooltipArea(ctx, { tooltip, hovered }),
			],
		});
	}
}
