import {
	Axis,
	Container,
	Expanded,
	Flex,
	GestureDetector,
	GlobalKey,
	LayoutBuilder,
	SizedBox,
	Stack,
	StackFit,
	State,
	StatefulWidget,
	StatelessWidget,
	type BuildContext,
	type Widget,
} from "flitter-core";
import { resolveOverlayRect } from "@headless/_shared/cartesian-scaffold";
import { TreemapChartProvider } from "./provider";
import type { TreemapLayout, TreemapResolvedNode } from "./types";

function buildLayoutTreeWidget(
	layout: TreemapLayout | null,
	buildLeaf: (index: number) => Widget,
): Widget {
	if (layout == null) return SizedBox.shrink();
	if (layout.kind === "leaf") {
		return buildLeaf(layout.index);
	}

	return Container({
		width: Infinity,
		height: Infinity,
		child: Flex({
			direction:
				layout.direction === "row" ? Axis.horizontal : Axis.vertical,
			children: layout.children.map((child) =>
				Expanded({
					flex: child.flex,
					child: buildLayoutTreeWidget(child.node, buildLeaf),
				}),
			),
		}),
	});
}

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);
		return LayoutBuilder({
			builder: (_ctx: BuildContext, constraints) => {
				ctx.setSize(constraints.maxWidth, constraints.maxHeight);
				return new Layout();
			},
		});
	}
}

export default Chart;

class Layout extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new TitleWidget(),
				legends: ctx.legends.map(
					(name, index) => new LegendWidget({ name, index }),
				),
				plot: new PlotWidget(),
			},
			ctx,
		);
	}
}

class TitleWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

class LegendWidget extends StatelessWidget {
	#name: string;
	#index: number;

	constructor({ name, index }: { name: string; index: number }) {
		super();
		this.#name = name;
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);
		return GestureDetector({
			onClick: () => ctx.toggleSeries(this.#name),
			child: ctx.custom.legend(
				{
					name: this.#name,
					index: this.#index,
					isVisible: ctx.isSeriesVisible(this.#name),
				},
				ctx,
			),
		});
	}
}

class PlotWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);
		return ctx.custom.plot(
			{
				treemap: new TreemapWidget(),
				tooltipArea: new TooltipAreaWidget(),
			},
			ctx,
		);
	}
}

class TreemapWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);

		return LayoutBuilder({
			builder: (_ctx, constraints) => {
				const width = constraints.maxWidth;
				const height = constraints.maxHeight;
				if (width <= 0 || height <= 0) {
					return SizedBox.shrink();
				}

				const totalValue = ctx.totalValue;
				const layout = ctx.getGroupLayout({ width, height });
				const tree = buildLayoutTreeWidget(layout, (groupIndex) => {
					const dataset = ctx.data.datasets[groupIndex];
					if (dataset == null) return SizedBox.shrink();

					return new GroupWidget({
						legend: dataset.legend,
						index: groupIndex,
						color: ctx.getGroupColor(groupIndex),
						ratio:
							totalValue > 0 ? ctx.getGroupValue(groupIndex) / totalValue : 0,
					});
				});

				return GestureDetector({
					behavior: "translucent",
					onMouseLeave: () => ctx.unhoverAllNodes(),
					child: ctx.custom.treemap({ tree }, ctx),
				});
			},
		});
	}
}

class GroupWidget extends StatelessWidget {
	#legend: string;
	#index: number;
	#color: string;
	#ratio: number;

	constructor(props: {
		legend: string;
		index: number;
		color: string;
		ratio: number;
	}) {
		super();
		this.#legend = props.legend;
		this.#index = props.index;
		this.#color = props.color;
		this.#ratio = props.ratio;
	}

	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);
		return ctx.custom.group(
			{
				title: new GroupTitleWidget({
					legend: this.#legend,
					index: this.#index,
				}),
				nodes: new NodesTreeWidget({
					groupIndex: this.#index,
					legend: this.#legend,
					nodes: ctx.getGroupNodes(this.#index),
				}),
				legend: this.#legend,
				index: this.#index,
				color: this.#color,
				ratio: this.#ratio,
				isHovered: ctx.isGroupHovered(this.#index),
			},
			ctx,
		);
	}
}

class GroupTitleWidget extends StatelessWidget {
	#legend: string;
	#index: number;

	constructor({ legend, index }: { legend: string; index: number }) {
		super();
		this.#legend = legend;
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);
		return ctx.custom.groupTitle(
			{ legend: this.#legend, index: this.#index },
			ctx,
		);
	}
}

class NodesTreeWidget extends StatelessWidget {
	#groupIndex: number;
	#legend: string;
	#nodes: TreemapResolvedNode[];

	constructor({
		groupIndex,
		legend,
		nodes,
	}: {
		groupIndex: number;
		legend: string;
		nodes: TreemapResolvedNode[];
	}) {
		super();
		this.#groupIndex = groupIndex;
		this.#legend = legend;
		this.#nodes = nodes;
	}

	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);

		return LayoutBuilder({
			builder: (_ctx, constraints) => {
				const width = constraints.maxWidth;
				const height = constraints.maxHeight;
				if (width <= 0 || height <= 0 || this.#nodes.length === 0) {
					return SizedBox.shrink();
				}

				const groupValue = ctx.getGroupValue(this.#groupIndex);
				const totalValue = ctx.totalValue;
				const layout = ctx.getNodeLayout(this.#nodes, { width, height });
				const tree = buildLayoutTreeWidget(layout, (index) => {
					const node = this.#nodes[index];
					if (node == null) return SizedBox.shrink();

					if (node.children.length > 0) {
						return new NodesTreeWidget({
							groupIndex: this.#groupIndex,
							legend: this.#legend,
							nodes: node.children,
						});
					}

					return new NodeWidget({
						node,
						legend: this.#legend,
						groupIndex: this.#groupIndex,
						index,
						color: ctx.getNodeColor(this.#groupIndex),
						ratio: totalValue > 0 ? node.value / totalValue : 0,
						groupRatio: groupValue > 0 ? node.value / groupValue : 0,
					});
				});

				return GestureDetector({
					behavior: "translucent",
					child: ctx.custom.nodes(
						{
							tree,
							legend: this.#legend,
							index: this.#groupIndex,
						},
						ctx,
					),
				});
			},
		});
	}
}

class DataLabelWidget extends StatelessWidget {
	#label: string;
	#secondaryLabel?: string;
	#value: number;
	#legend: string;
	#groupIndex: number;
	#index: number;
	#ratio: number;
	#groupRatio: number;
	#isHovered: boolean;

	constructor(props: {
		label: string;
		secondaryLabel?: string;
		value: number;
		legend: string;
		groupIndex: number;
		index: number;
		ratio: number;
		groupRatio: number;
		isHovered: boolean;
	}) {
		super();
		this.#label = props.label;
		this.#secondaryLabel = props.secondaryLabel;
		this.#value = props.value;
		this.#legend = props.legend;
		this.#groupIndex = props.groupIndex;
		this.#index = props.index;
		this.#ratio = props.ratio;
		this.#groupRatio = props.groupRatio;
		this.#isHovered = props.isHovered;
	}

	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);
		return ctx.custom.dataLabel(
			{
				label: this.#label,
				secondaryLabel: this.#secondaryLabel,
				value: this.#value,
				legend: this.#legend,
				groupIndex: this.#groupIndex,
				index: this.#index,
				ratio: this.#ratio,
				groupRatio: this.#groupRatio,
				isHovered: this.#isHovered,
			},
			ctx,
		);
	}
}

class NodeWidget extends StatefulWidget {
	node: TreemapResolvedNode;
	legend: string;
	groupIndex: number;
	index: number;
	color: string;
	ratio: number;
	groupRatio: number;

	constructor(props: {
		node: TreemapResolvedNode;
		legend: string;
		groupIndex: number;
		index: number;
		color: string;
		ratio: number;
		groupRatio: number;
	}) {
		super();
		this.node = props.node;
		this.legend = props.legend;
		this.groupIndex = props.groupIndex;
		this.index = props.index;
		this.color = props.color;
		this.ratio = props.ratio;
		this.groupRatio = props.groupRatio;
	}

	createState() {
		return new NodeWidgetState();
	}
}

class NodeWidgetState extends State<NodeWidget> {
	anchorKey = new GlobalKey();

	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);
		const { node, legend, groupIndex, index, color, ratio, groupRatio } =
			this.widget;
		const isHovered = ctx.isNodeHovered(node.key);

		return GestureDetector({
			key: this.anchorKey,
			cursor: "default",
			onMouseEnter: () =>
				ctx.hoverNode(
					{
						key: node.key,
						label: node.label,
						secondaryLabel: node.secondaryLabel,
						value: node.value,
						legend,
						groupIndex,
						color,
					},
					this.anchorKey,
				),
			onMouseLeave: () => ctx.unhoverNode(node.key),
			child: ctx.custom.node(
				{
					label: node.label,
					secondaryLabel: node.secondaryLabel,
					value: node.value,
					legend,
					groupIndex,
					index,
					color,
					ratio,
					groupRatio,
					isHovered,
					dataLabel: new DataLabelWidget({
						label: node.label,
						secondaryLabel: node.secondaryLabel,
						value: node.value,
						legend,
						groupIndex,
						index,
						ratio,
						groupRatio,
						isHovered,
					}),
				},
				ctx,
			),
		});
	}
}

class TooltipAreaWidget extends StatefulWidget {
	createState() {
		return new TooltipAreaWidgetState();
	}
}

class TooltipAreaWidgetState extends State<TooltipAreaWidget> {
	overlayKey = new GlobalKey();

	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);
		const hoveredNode = ctx.hoveredNode;
		const anchorKey = ctx.hoveredNodeAnchorKey;
		const rect =
			hoveredNode == null || anchorKey == null
				? null
				: resolveOverlayRect(this.overlayKey, anchorKey);
		const resolvedHoveredNode =
			hoveredNode == null || rect == null ? null : { ...hoveredNode, ...rect };
		const tooltip =
			hoveredNode == null
				? null
				: ctx.custom.tooltip(
						{
							label: hoveredNode.label,
							items: [
								{
									legend: hoveredNode.legend,
									color: hoveredNode.color,
									value: hoveredNode.value,
								},
							],
						},
						ctx,
					);

		return Stack({
			fit: StackFit.expand,
			clipped: false,
			children: [
				SizedBox({
					key: this.overlayKey,
					width: Infinity,
					height: Infinity,
				}),
				ctx.custom.tooltipArea(
					{ tooltip, hoveredNode: resolvedHoveredNode },
					ctx,
				),
			],
		});
	}
}
