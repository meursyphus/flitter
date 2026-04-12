import {
	Alignment,
	Constraints,
	MultiChildRenderObject,
	MultiChildRenderObjectWidget,
	Offset,
	Size,
	Stack,
	StackFit,
	Transform,
	type Widget,
} from "flitter-core";

const EPSILON = 0.0001;
const PLOT_CHILD_OFFSET = 1;

type PieLikeRadialItem = {
	angle: number;
	tick: Widget;
	label: Widget;
};

class PiePlotLayout extends MultiChildRenderObjectWidget {
	angles: number[];
	itemCount: number;
	gap: number;

	constructor({
		content,
		radialItems,
		gap,
		key,
	}: {
		content: Widget;
		radialItems: PieLikeRadialItem[];
		gap: number;
		key?: any;
	}) {
		super({
				key,
				children: [
					content,
					...radialItems.map((item) =>
						Transform.rotate({
							angle: item.angle + Math.PI / 2,
							alignment: Alignment.bottomCenter,
							child: item.tick,
						}),
					),
					...radialItems.map((item) => item.label),
				],
		});
		this.angles = radialItems.map((item) => item.angle);
		this.itemCount = radialItems.length;
		this.gap = gap;
	}

	override createRenderObject(): RenderPiePlotLayout {
		return new RenderPiePlotLayout({
			angles: this.angles,
			itemCount: this.itemCount,
			gap: this.gap,
		});
	}

	override updateRenderObject(renderObject: RenderPiePlotLayout): void {
		renderObject.angles = this.angles;
		renderObject.itemCount = this.itemCount;
		renderObject.gap = this.gap;
	}
}

class RenderPiePlotLayout extends MultiChildRenderObject {
	#angles: number[];
	#itemCount: number;
	#gap: number;

	constructor({
		angles,
		itemCount,
		gap,
	}: {
		angles: number[];
		itemCount: number;
		gap: number;
	}) {
		super({ isPainter: false });
		this.#angles = angles;
		this.#itemCount = itemCount;
		this.#gap = gap;
	}

	get angles(): number[] {
		return this.#angles;
	}

	set angles(value: number[]) {
		if (
			value.length === this.#angles.length &&
			value.every((angle, index) => angle === this.#angles[index])
		) {
			return;
		}
		this.#angles = value;
		this.markNeedsLayout();
	}

	get itemCount(): number {
		return this.#itemCount;
	}

	set itemCount(value: number) {
		if (value === this.#itemCount) return;
		this.#itemCount = value;
		this.markNeedsLayout();
	}

	get gap(): number {
		return this.#gap;
	}

	set gap(value: number) {
		if (value === this.#gap) return;
		this.#gap = value;
		this.markNeedsLayout();
	}

	override get sizedByParent(): boolean {
		return true;
	}

	protected override performResize(): void {
		this.size = this.constraints.constrain(Size.infinite);
	}

	protected override computeDryLayout(constraints: Constraints): Size {
		return constraints.constrain(Size.infinite);
	}

	protected preformLayout(): void {
		const width = Number.isFinite(this.size.width) ? this.size.width : 0;
		const height = Number.isFinite(this.size.height) ? this.size.height : 0;
		const plotSize = new Size({ width, height });

		if (this.children.length === 0) {
			this.size = this.constraints.constrain(Size.zero);
			return;
		}

		const content = this.children[0];
		const looseConstraints = new Constraints({
			maxWidth: width,
			maxHeight: height,
		});

		for (let index = 0; index < this.itemCount; index += 1) {
			this.tickChild(index)?.layout(looseConstraints, { parentUsesSize: true });
			this.labelChild(index)?.layout(looseConstraints, { parentUsesSize: true });
		}

		const radius = this.resolveRadius(plotSize);
		const diameter = Math.max(0, radius * 2);
		const contentSize = new Size({ width: diameter, height: diameter });
		content.layout(Constraints.tight(contentSize), { parentUsesSize: false });
		content.offset = new Offset({
			x: (width - diameter) / 2,
			y: (height - diameter) / 2,
		});

		this.positionRadialChildren(plotSize, radius);
	}

	protected override computeIntrinsicWidth(height: number): number {
		return this.children.reduce(
			(maxWidth, child) => Math.max(maxWidth, child.getIntrinsicWidth(height)),
			0,
		);
	}

	protected override computeIntrinsicHeight(width: number): number {
		return this.children.reduce(
			(maxHeight, child) => Math.max(maxHeight, child.getIntrinsicHeight(width)),
			0,
		);
	}

	private tickChild(index: number) {
		return this.children[PLOT_CHILD_OFFSET + index];
	}

	private labelChild(index: number) {
		return this.children[PLOT_CHILD_OFFSET + this.itemCount + index];
	}

	private resolveRadius(plotSize: Size): number {
		let min = 0;
		let max = Math.max(0, Math.min(plotSize.width, plotSize.height) / 2);

		for (let step = 0; step < 24; step += 1) {
			const candidate = (min + max) / 2;
			if (this.fits(plotSize, candidate)) {
				min = candidate;
			} else {
				max = candidate;
			}
		}

		return min;
	}

	private fits(plotSize: Size, radius: number): boolean {
		const centerX = plotSize.width / 2;
		const centerY = plotSize.height / 2;

		for (let index = 0; index < this.itemCount; index += 1) {
			const angle = this.angles[index] ?? 0;
			const dx = Math.cos(angle);
			const dy = Math.sin(angle);
			const tick = this.tickChild(index);
			const label = this.labelChild(index);

			const startX = centerX + radius * dx;
			const startY = centerY + radius * dy;

			if (tick != null) {
				const tickRect = this.resolveTickRect(tick.size, startX, startY, angle);
				if (!this.isInside(plotSize, tickRect)) return false;
			}

			if (label != null) {
				const tickExtent = tick == null ? 0 : tick.size.height;
				const anchorX = startX + dx * (tickExtent + this.#gap);
				const anchorY = startY + dy * (tickExtent + this.#gap);
				const labelRect = this.resolveLabelRect(label.size, anchorX, anchorY, dx, dy);
				if (!this.isInside(plotSize, labelRect)) return false;
			}
		}

		return true;
	}

	private positionRadialChildren(plotSize: Size, radius: number): void {
		const centerX = plotSize.width / 2;
		const centerY = plotSize.height / 2;

		for (let index = 0; index < this.itemCount; index += 1) {
			const angle = this.angles[index] ?? 0;
			const dx = Math.cos(angle);
			const dy = Math.sin(angle);
			const tick = this.tickChild(index);
			const label = this.labelChild(index);
			const startX = centerX + radius * dx;
			const startY = centerY + radius * dy;

			const tickExtent = tick == null ? 0 : tick.size.height;

			if (tick != null) {
				tick.offset = new Offset({
					x: startX - tick.size.width / 2,
					y: startY - tick.size.height,
				});
			}

			if (label != null) {
				const anchorX = startX + dx * (tickExtent + this.#gap);
				const anchorY = startY + dy * (tickExtent + this.#gap);
				const rect = this.resolveLabelRect(label.size, anchorX, anchorY, dx, dy);
				label.offset = new Offset({
					x: rect.left,
					y: rect.top,
				});
			}
		}
	}

	private resolveTickRect(
		size: Size,
		anchorX: number,
		anchorY: number,
		angle: number,
	) {
		const rotation = angle + Math.PI / 2;
		const cos = Math.cos(rotation);
		const sin = Math.sin(rotation);
		const halfWidth = size.width / 2;
		const height = size.height;
		const corners = [
			{ x: -halfWidth, y: -height },
			{ x: halfWidth, y: -height },
			{ x: halfWidth, y: 0 },
			{ x: -halfWidth, y: 0 },
		].map(({ x, y }) => ({
			x: anchorX + x * cos - y * sin,
			y: anchorY + x * sin + y * cos,
		}));

		return {
			left: Math.min(...corners.map((point) => point.x)),
			top: Math.min(...corners.map((point) => point.y)),
			right: Math.max(...corners.map((point) => point.x)),
			bottom: Math.max(...corners.map((point) => point.y)),
		};
	}

	private resolveLabelRect(
		size: Size,
		anchorX: number,
		anchorY: number,
		dx: number,
		dy: number,
	) {
		const left = Math.abs(dx) <= EPSILON
			? anchorX - size.width / 2
			: dx > 0
				? anchorX
				: anchorX - size.width;
		const top = Math.abs(dy) <= EPSILON
			? anchorY - size.height / 2
			: dy > 0
				? anchorY
				: anchorY - size.height;

		return {
			left,
			top,
			right: left + size.width,
			bottom: top + size.height,
		};
	}

	private isInside(
		plotSize: Size,
		rect: { left: number; top: number; right: number; bottom: number },
	): boolean {
		return (
			rect.left >= -EPSILON &&
			rect.top >= -EPSILON &&
			rect.right <= plotSize.width + EPSILON &&
			rect.bottom <= plotSize.height + EPSILON
		);
	}
}

export function Plot(
	{
		dataView,
		tooltipArea,
		radialItems,
	}: {
		dataView: Widget;
		tooltipArea: Widget;
		radialItems: PieLikeRadialItem[];
	},
	context: { config?: { radial?: { gap?: number } } },
): Widget {
	return new PiePlotLayout({
		radialItems,
		gap: Math.max(0, context.config?.radial?.gap ?? 6),
		content: Stack({
			fit: StackFit.expand,
			clipped: false,
			children: [dataView, tooltipArea],
		}),
	});
}
