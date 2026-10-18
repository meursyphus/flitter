import { describe, expect, it } from 'vitest';
import { adjustWaypoints, getEdgePathByType } from '../../../packages/diagram/src/shared/edges';
const params = {
	sourceX: 0,
	sourceY: 0,
	targetX: 200,
	targetY: 200,
	waypoints: [
		{ x: 50, y: 100 },
		{ x: 150, y: 100 }
	]
};
describe('waypoint routing', () => {
	it('straight routes through vertices and bezier interpolates them', () => {
		for (const type of ['straight', 'bezier']) {
			const path = getEdgePathByType(type, params);
			for (const point of params.waypoints) expect(path.points).toContainEqual(point);
			expect(path.points[0]).toEqual({ x: 0, y: 0 });
			expect(path.points.at(-1)).toEqual({ x: 200, y: 200 });
		}
	});
	it('step is orthogonal and smoothstep rounds bends', () => {
		const path = getEdgePathByType('step', params);
		for (let i = 1; i < path.points.length; i++)
			expect(
				path.points[i].x === path.points[i - 1].x || path.points[i].y === path.points[i - 1].y
			).toBe(true);
		expect(getEdgePathByType('smoothstep', params).commands.some((c) => c.type === 'Q')).toBe(true);
	});
	it('adjusts ends or stretches vertices without mutating the original points', () => {
		const points = [
				{ x: 20, y: 20 },
				{ x: 100, y: 100 },
				{ x: 180, y: 180 }
			],
			next = { ...params, sourceX: 10, targetX: 300 };
		expect(adjustWaypoints(points, params, next, 'none')).toEqual(points);
		expect(adjustWaypoints(points, params, next, 'ends').map((p) => p.x)).toEqual([30, 100, 280]);
		expect(adjustWaypoints(points, params, next, 'stretch').map((p) => p.x)).toEqual([
			39, 155, 271
		]);
		expect(points[0].x).toBe(20);
	});
});
