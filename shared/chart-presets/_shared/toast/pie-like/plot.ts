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
} from "flitter-ui";

import { stackLabels } from "./labels";

const EPSILON = 0.0001;
const PLOT_CHILD_OFFSET = 1;
const LABEL_STACK_GAP = 2;

type Rect = { left: number; top: number; right: number; bottom: number };
type SideRect = Rect & { side: "left" | "right" };

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

	protected preformLayout(): void {
		this.size = this.constraints.constrain(Size.infinite);

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
			this.tickChild(index)?.layout(looseConstraints);
			this.labelChild(index)?.layout(looseConstraints);
		}

		const radius = this.resolveRadius(plotSize);
		const diameter = Math.max(0, radius * 2);
		const contentSize = new Size({ width: diameter, height: diameter });
		content.layout(Constraints.tight(contentSize));
		content.offset = new Offset({
			x: (width - diameter) / 2,
			y: (height - diameter) / 2,
		});

		this.positionRadialChildren(plotSize, radius);
	}

	override getIntrinsicWidth(height: number): number {
		return this.children.reduce(
			(maxWidth, child) => Math.max(maxWidth, child.getIntrinsicWidth(height)),
			0,
		);
	}

	override getIntrinsicHeight(width: number): number {
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
		const { ticks, initialLabels, labels, stackFits } = this.resolveRadialRects(plotSize, radius);

		for (const rect of ticks) {
			if (rect != null && !this.isInside(plotSize, rect)) return false;
		}

		// Where each label would sit without stacking must fit as well, so stacking
		// only ever shrinks the pie, never grows it by pulling labels inwards.
		for (const rect of initialLabels) {
			if (rect != null && !this.isInside(plotSize, rect)) return false;
		}

		for (let index = 0; index < labels.length; index += 1) {
			const rect = labels[index];
			if (rect == null) continue;
			// A side whose stack is taller than the plot can never fit; only its
			// horizontal extent then limits the radius, or the pie would collapse.
			const vertical = stackFits[rect.side];
			if (!this.isInside(plotSize, rect, vertical)) return false;
		}

		return true;
	}

	private positionRadialChildren(plotSize: Size, radius: number): void {
		const { ticks, labels } = this.resolveRadialRects(plotSize, radius);

		for (let index = 0; index < this.itemCount; index += 1) {
			const tick = this.tickChild(index);
			const label = this.labelChild(index);
			const angle = this.angles[index] ?? 0;
			const startX = plotSize.width / 2 + radius * Math.cos(angle);
			const startY = plotSize.height / 2 + radius * Math.sin(angle);

			if (tick != null && ticks[index] != null) {
				tick.offset = new Offset({
					x: startX - tick.size.width / 2,
					y: startY - tick.size.height,
				});
			}

			const rect = labels[index];
			if (label != null && rect != null) {
				label.offset = new Offset({ x: rect.left, y: rect.top });
			}
		}
	}

	/**
	 * Tick and label rects for a radius. Labels start at the end of their tick,
	 * then each side is stacked so neighbours never overlap; a label that had
	 * to move slides along the label circle so it stays clear of the pie.
	 */
	private resolveRadialRects(plotSize: Size, radius: number) {
		const centerX = plotSize.width / 2;
		const centerY = plotSize.height / 2;
		const ticks: (Rect | null)[] = [];
		const labels: (SideRect | null)[] = [];
		const anchors: { x: number; y: number; dx: number; dy: number; reach: number }[] = [];

		for (let index = 0; index < this.itemCount; index += 1) {
			const angle = this.angles[index] ?? 0;
			const dx = Math.cos(angle);
			const dy = Math.sin(angle);
			const tick = this.tickChild(index);
			const label = this.labelChild(index);
			const startX = centerX + radius * dx;
			const startY = centerY + radius * dy;
			const tickExtent = tick == null ? 0 : tick.size.height;
			const reach = radius + tickExtent + this.#gap;

			ticks.push(tick == null ? null : this.resolveTickRect(tick.size, startX, startY, angle));

			const anchor = { x: centerX + dx * reach, y: centerY + dy * reach, dx, dy, reach };
			anchors.push(anchor);
			labels.push(
				label == null
					? null
					: {
						...this.resolveLabelRect(label.size, anchor.x, anchor.y, dx, dy),
						side: dx >= 0 ? "right" : "left",
					},
			);
		}

		const initialLabels = [...labels];
		const stackFits = { left: true, right: true };

		for (const side of ["left", "right"] as const) {
			const members = labels
				.map((rect, index) => ({ rect, index }))
				.filter((entry): entry is { rect: SideRect; index: number } =>
					entry.rect != null && entry.rect.side === side,
				);
			const sized = members.filter(({ rect }) => rect.bottom - rect.top > 0);
			const stackHeight = sized.reduce((sum, { rect }) => sum + rect.bottom - rect.top, 0)
				+ Math.max(0, sized.length - 1) * LABEL_STACK_GAP;
			stackFits[side] = stackHeight <= plotSize.height + EPSILON;

			const tops = stackLabels(
				members.map(({ rect }) => ({ top: rect.top, height: rect.bottom - rect.top })),
				{ minY: 0, maxY: plotSize.height, gap: LABEL_STACK_GAP },
			);

			members.forEach(({ rect, index }, memberIndex) => {
				const shift = tops[memberIndex] - rect.top;
				if (Math.abs(shift) <= EPSILON) return;

				const anchor = anchors[index];
				const label = this.labelChild(index)!;
				const anchorY = anchor.y + shift;
				const offsetY = anchorY - centerY;
				const sign = side === "right" ? 1 : -1;
				const anchorX = Math.abs(offsetY) < anchor.reach
					? centerX + sign * Math.sqrt(anchor.reach ** 2 - offsetY ** 2)
					: centerX;
				const moved = this.resolveLabelRect(label.size, anchorX, anchor.y, anchor.dx, anchor.dy);
				labels[index] = {
					left: moved.left,
					right: moved.right,
					top: tops[memberIndex],
					bottom: tops[memberIndex] + label.size.height,
					side,
				};
			});
		}

		return { ticks, initialLabels, labels, stackFits };
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

	private isInside(plotSize: Size, rect: Rect, vertical = true): boolean {
		const horizontal = rect.left >= -EPSILON && rect.right <= plotSize.width + EPSILON;
		if (!vertical) return horizontal;
		return horizontal && rect.top >= -EPSILON && rect.bottom <= plotSize.height + EPSILON;
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
