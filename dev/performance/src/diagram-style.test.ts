import { describe, expect, it } from 'vitest';
import {
	FlowDiagramController,
	type FlowDiagramContext,
	type FlowDiagramCustom
} from '../../../packages/diagram/src/engine';
import { baseDefaults } from '../../../packages/diagram/registry/templates/diagrams/flow-diagram/base';
import {
	defaultStyleConfig,
	defaultContextMenu,
	defaultMenuItem,
	defaultMinimapMask,
	defaultMinimapViewport,
	type DefaultFlowConfig
} from '../../../packages/diagram/registry/templates/diagrams/flow-diagram/styles/default';

function context(colorMode: 'light' | 'dark') {
	const flow = new FlowDiagramController() as FlowDiagramContext<DefaultFlowConfig>;
	flow.configure({
		data: { nodes: [], edges: [] },
		config: defaultStyleConfig.createConfig({ colorMode }),
		custom: {
			...baseDefaults,
			...defaultStyleConfig.custom
		} as FlowDiagramCustom<DefaultFlowConfig>
	});
	return flow;
}
function texts(widget: any): any[] {
	if (widget.runtimeType === '_Text') return [widget];
	if (typeof widget.build === 'function') return texts(widget.build({}));
	return (widget.children ?? (widget.child ? [widget.child] : [])).flatMap(texts);
}
function luminance(hex: string) {
	const c = hex
		.slice(1)
		.match(/../g)!
		.map((n) => parseInt(n, 16) / 255)
		.map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4));
	return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
}

for (const theme of ['light', 'dark'] as const)
	describe(`${theme} diagram parts`, () => {
		it('keeps the minimap viewport clear and outlines it independently of the outside mask', () => {
			const flow = context(theme);
			const rect = { x: 20, y: 20, width: 80, height: 60 };
			const maskPaint = defaultMinimapMask({ width: 200, height: 150, rect }, flow) as any;
			const viewportPaint = (defaultMinimapViewport({ rect }, flow) as any).child;
			const attributes = (paint: any) => {
				const elements = paint.painter.svg.createDefaultSvgEl({
					createSvgEl: () => ({
						attrs: {} as Record<string, string>,
						setAttribute(key: string, value: string) {
							this.attrs[key] = value;
						},
						removeAttribute(key: string) {
							delete this.attrs[key];
						}
					})
				});
				paint.painter.svg.paint(elements);
				return elements;
			};
			const viewport = attributes(viewportPaint).viewport.attrs;
			const elements = attributes(maskPaint);
			expect(viewport.fill).toBe('none');
			expect(viewport.stroke).toBe(flow.config.colors.minimapViewportStroke);
			expect(viewport['stroke-width']).toBe('2');
			const rectangles = (d: string) =>
				[...d.matchAll(/M([\d.-]+) ([\d.-]+)h([\d.-]+)v([\d.-]+)/g)].map(
					([, x, y, width, height]) => ({ x: +x, y: +y, width: +width, height: +height })
				);
			const view = rect;
			const center = { x: view.x + view.width / 2, y: view.y + view.height / 2 };
			const mask = rectangles(elements.mask.attrs.d);
			expect(mask).toHaveLength(4);
			expect(
				mask.some(
					(r) =>
						center.x > r.x &&
						center.x < r.x + r.width &&
						center.y > r.y &&
						center.y < r.y + r.height
				)
			).toBe(false);
			const levels = [
				luminance(flow.config.colors.minimapBackground),
				luminance(flow.config.colors.minimapNode)
			].sort((a, b) => a - b);
			expect((levels[1] + 0.05) / (levels[0] + 0.05)).toBeGreaterThan(3);
			flow.dispose();
		});
		it('uses context-menu radius/shadow tokens and inherits the diagram font', () => {
			const flow = context(theme);
			flow.config.node.fontFamily = 'Fixture Sans';
			flow.config.node.fontSize = 15;
			flow.config.contextMenu.borderRadius = 10;
			const menu = defaultContextMenu(
				{
					target: 'pane',
					ids: [],
					position: { x: 0, y: 0 },
					screenPosition: { x: 0, y: 0 },
					items: [
						defaultMenuItem(
							{
								label: 'Duplicate',
								index: 0,
								isHovered: false,
								isDisabled: false,
								isSeparator: false
							},
							flow
						)
					]
				},
				flow
			) as any;
			expect(menu.decoration.borderRadius.topLeft.x).toBe(10);
			expect(menu.decoration.boxShadow[0].blurRadius).toBe(12);
			expect(texts(menu).length).toBeGreaterThan(0);
			for (const text of texts(menu)) {
				expect(text.style.fontFamily).toBe('Fixture Sans');
				expect(text.style.fontSize).toBe(15);
			}
			flow.dispose();
		});
	});
