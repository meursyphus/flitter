import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
import { SankeyChartProvider } from "./provider";

class SankeyChart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

export default SankeyChart;

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = SankeyChartProvider.of(context);
		return LayoutBuilder({
			builder: (_ctx, constraints) => {
				ctx.setSize(constraints.maxWidth, constraints.maxHeight);
				return new LayoutWidget();
			},
		});
	}
}

class LayoutWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = SankeyChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new TitleWidget(),
				dataView: new SankeyWidget(),
			},
			ctx,
		);
	}
}

class TitleWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = SankeyChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

class SankeyWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = SankeyChartProvider.of(context);
		const sankeyLayout = ctx.layout;

		const nodes = sankeyLayout.nodes.map(
			(node) =>
				new NodeWidget({
					id: node.id,
					label: node.label,
					color: node.color,
					x: node.x,
					y: node.y,
					width: node.width,
					height: node.height,
				}),
		);

		const links = sankeyLayout.links.map(
			(link) =>
				new LinkWidget({
					source: link.source,
					target: link.target,
					value: link.value,
					sourceX: link.sourceX,
					sourceY: link.sourceY,
					sourceHeight: link.sourceHeight,
					targetX: link.targetX,
					targetY: link.targetY,
					targetHeight: link.targetHeight,
					color: link.color,
				}),
		);

		const nodeLabels = sankeyLayout.nodes.map(
			(node) =>
				new NodeLabelWidget({
					id: node.id,
					label: node.label,
					x: node.x,
					y: node.y,
					width: node.width,
					height: node.height,
					column: node.column,
					totalColumns: sankeyLayout.totalColumns,
				}),
		);

		return ctx.custom.dataView({ nodes, links, nodeLabels }, ctx);
	}
}

class NodeWidget extends StatelessWidget {
  #id: string;
  #label: string;
  #color: string;
  #x: number;
  #y: number;
  #width: number;
  #height: number;

  constructor(props: {
    id: string;
    label: string;
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    super();
    this.#id = props.id;
    this.#label = props.label;
    this.#color = props.color;
    this.#x = props.x;
    this.#y = props.y;
    this.#width = props.width;
    this.#height = props.height;
  }

	override build(context: BuildContext): Widget {
		const ctx = SankeyChartProvider.of(context);
		return ctx.custom.node(
			{
				id: this.#id,
				label: this.#label,
				color: this.#color,
				x: this.#x,
				y: this.#y,
				width: this.#width,
				height: this.#height,
			},
			ctx,
		);
	}
}

class LinkWidget extends StatelessWidget {
  #source: string;
  #target: string;
  #value: number;
  #sourceX: number;
  #sourceY: number;
  #sourceHeight: number;
  #targetX: number;
  #targetY: number;
  #targetHeight: number;
  #color: string;

  constructor(props: {
    source: string;
    target: string;
    value: number;
    sourceX: number;
    sourceY: number;
    sourceHeight: number;
    targetX: number;
    targetY: number;
    targetHeight: number;
    color: string;
  }) {
    super();
    this.#source = props.source;
    this.#target = props.target;
    this.#value = props.value;
    this.#sourceX = props.sourceX;
    this.#sourceY = props.sourceY;
    this.#sourceHeight = props.sourceHeight;
    this.#targetX = props.targetX;
    this.#targetY = props.targetY;
    this.#targetHeight = props.targetHeight;
    this.#color = props.color;
  }

	override build(context: BuildContext): Widget {
		const ctx = SankeyChartProvider.of(context);
		return ctx.custom.link(
			{
				source: this.#source,
				target: this.#target,
				value: this.#value,
				sourceX: this.#sourceX,
				sourceY: this.#sourceY,
				sourceHeight: this.#sourceHeight,
				targetX: this.#targetX,
				targetY: this.#targetY,
				targetHeight: this.#targetHeight,
				color: this.#color,
			},
			ctx,
		);
	}
}

class NodeLabelWidget extends StatelessWidget {
  #id: string;
  #label: string;
  #x: number;
  #y: number;
  #width: number;
  #height: number;
  #column: number;
  #totalColumns: number;

  constructor(props: {
    id: string;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    column: number;
    totalColumns: number;
  }) {
    super();
    this.#id = props.id;
    this.#label = props.label;
    this.#x = props.x;
    this.#y = props.y;
    this.#width = props.width;
    this.#height = props.height;
    this.#column = props.column;
    this.#totalColumns = props.totalColumns;
  }

	override build(context: BuildContext): Widget {
		const ctx = SankeyChartProvider.of(context);
		return ctx.custom.nodeLabel(
			{
				id: this.#id,
				label: this.#label,
				x: this.#x,
				y: this.#y,
				width: this.#width,
				height: this.#height,
				column: this.#column,
				totalColumns: this.#totalColumns,
			},
			ctx,
		);
	}
}
