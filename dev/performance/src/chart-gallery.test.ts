import { describe, expect, it } from 'vitest';
import { FunnelChartController } from '../../../packages/chart/src/headless/funnel-chart/controller';
import type { FunnelChartCustom } from '../../../packages/chart/src/headless/funnel-chart/types';
import {
	createArcPath,
	getRingMetrics
} from '../../../packages/chart/registry/templates/charts/sunburst-chart/base/geometry';
import { SunburstChartController } from '../../../packages/chart/src/headless/sunburst-chart/controller';
import type { SunburstChartCustom } from '../../../packages/chart/src/headless/sunburst-chart/types';
import {
	stageContains,
	stageGeometry
} from '../../../packages/chart/registry/templates/charts/funnel-chart/base/geometry';
import { defaultFunnelAppearance } from '../../../packages/chart/registry/templates/charts/funnel-chart/base/config';

const custom = {} as FunnelChartCustom;
const data = {
	stages: [
		{ label: 'Visits', value: 100 },
		{ label: 'Trial', value: 40 },
		{ label: 'Paid', value: 10 }
	]
};

describe('Funnel stages', () => {
	it('preserves input order and distinguishes overall share from step conversion', () => {
		const controller = new FunnelChartController({ data, custom, config: {} });
		expect(controller.stages.map((stage) => stage.label)).toEqual(['Visits', 'Trial', 'Paid']);
		expect(controller.stages[2]).toMatchObject({
			percentage: 10,
			conversion: 25,
			topWidth: 0.1,
			bottomWidth: 0.1
		});
		controller.toggleStage(1);
		expect(controller.stages.map((stage) => stage.index)).toEqual([0, 2]);
		expect(controller.stages[1]).toMatchObject({ percentage: 10, conversion: 25 });
		expect(controller.stages[0].bottomWidth).toBe(0.1);
	});

	it('handles zero, negative and non-finite values without invalid geometry', () => {
		const controller = new FunnelChartController({
			data: {
				stages: [
					{ label: 'Zero', value: 0 },
					{ label: 'Invalid', value: NaN },
					{ label: 'Negative', value: -5 }
				]
			},
			custom,
			config: {}
		});
		expect(controller.stages).toEqual([]);
		controller.update({
			data: {
				stages: [
					{ label: 'Zero', value: 0 },
					{ label: 'New', value: 20 }
				]
			},
			custom,
			config: {}
		});
		expect(controller.stages[1]).toMatchObject({ percentage: 0, conversion: null, topWidth: 1 });
	});

	it('does not clear a newer hover when an older stage leaves, and clears hidden hover', () => {
		const controller = new FunnelChartController({ data, custom, config: {} });
		controller.hoverStage(0);
		controller.hoverStage(1);
		controller.unhoverStage(0);
		expect(controller.hoveredIndex).toBe(1);
		controller.toggleStage(1);
		expect(controller.hoveredStage).toBeNull();
		controller.hoverStage(1);
		expect(controller.hoveredIndex).toBeNull();
		controller.update({
			data: { stages: [{ label: 'Replacement', value: 8 }] },
			custom,
			config: {}
		});
		expect(controller.stages).toHaveLength(1);
	});

	it('hit-tests the trapezoid interior while excluding gaps and empty corners', () => {
		const stage = new FunnelChartController({ data, custom, config: {} }).stages[0];
		const geometry = stageGeometry(stage, 600, 100, defaultFunnelAppearance);
		expect(stageContains({ x: geometry.center, y: 50 }, geometry)).toBe(true);
		expect(stageContains({ x: 1, y: 90 }, geometry)).toBe(false);
		expect(stageContains({ x: geometry.center, y: 0 }, geometry)).toBe(false);
		expect(stageContains({ x: 550, y: 50 }, geometry)).toBe(false);
	});
});

it('Sunburst keeps a full ring after filtering down to one branch', () => {
	const controller = new SunburstChartController({
		data: {
			nodes: [
				{ label: 'A', value: 60, children: [] },
				{ label: 'B', value: 40, children: [] }
			]
		},
		custom: {} as SunburstChartCustom
	});
	controller.toggleLegend(1);
	expect(controller.segments[0].sweepAngle).toBeCloseTo(Math.PI * 2);
	const metrics = getRingMetrics(400, 400, controller.segments)!;
	const path = createArcPath(metrics, controller.segments[0]);
	expect(path.match(/[Aa]/g)).toHaveLength(4);
	expect(path).not.toMatch(/NaN|Infinity/);
});
